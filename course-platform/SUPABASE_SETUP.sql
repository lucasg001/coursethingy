-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  checkpoints JSONB,
  pdfs JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (instructor_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create profiles table (for user information)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can see their own courses
CREATE POLICY "Users can view their own courses" ON courses
  FOR SELECT USING (auth.uid() = instructor_id);

-- RLS Policy: Users can insert their own courses
CREATE POLICY "Users can insert their own courses" ON courses
  FOR INSERT WITH CHECK (auth.uid() = instructor_id);

-- RLS Policy: Users can update their own courses
CREATE POLICY "Users can update their own courses" ON courses
  FOR UPDATE USING (auth.uid() = instructor_id)
  WITH CHECK (auth.uid() = instructor_id);

-- RLS Policy: Users can delete their own courses
CREATE POLICY "Users can delete their own courses" ON courses
  FOR DELETE USING (auth.uid() = instructor_id);

-- RLS Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- RLS Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
