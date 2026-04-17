-- GAMIFICATION SETUP

-- Add points column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points INT DEFAULT 0;

-- Prevent direct client-side updates to points using a trigger
CREATE OR REPLACE FUNCTION protect_points_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If points changed and the current user is not a service_role/admin
  IF NEW.points IS DISTINCT FROM OLD.points AND current_setting('role', true) IN ('authenticated', 'anon') THEN
    -- Allow the change only if it's coming from an explicitly authorized context
    -- For this prototype, we'll enforce that the change must come from our RPC function
    -- by setting a local variable inside the RPC function.
    IF current_setting('gamification.is_rpc', true) != 'true' THEN
      RAISE EXCEPTION 'Direct point manipulations are not allowed. Use the add_points RPC.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_protect_points ON profiles;
CREATE TRIGGER tr_protect_points
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION protect_points_update();

-- Secure RPC function to add points
CREATE OR REPLACE FUNCTION add_points(amount INT)
RETURNS void AS $$
BEGIN
  -- Validate amount
  IF amount <= 0 OR amount > 1000 THEN
    RAISE EXCEPTION 'Invalid points amount';
  END IF;
  
  -- Set local transaction variable to bypass trigger
  PERFORM set_config('gamification.is_rpc', 'true', true);
  
  UPDATE profiles 
  SET points = COALESCE(points, 0) + amount 
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
