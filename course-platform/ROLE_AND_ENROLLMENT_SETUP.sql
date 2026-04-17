-- ADD ROLE COLUMN TO PROFILES --
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('student', 'creator')) DEFAULT 'student';

-- Update existing profiles that might have created courses to 'creator' automatically
UPDATE profiles
SET role = 'creator'
WHERE id IN (SELECT DISTINCT instructor_id FROM courses);

-- CREATOR FOLLOWERS TABLE --
CREATE TABLE IF NOT EXISTS creator_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, creator_id)
);

CREATE INDEX IF NOT EXISTS idx_followers_student_id ON creator_followers(student_id);
CREATE INDEX IF NOT EXISTS idx_followers_creator_id ON creator_followers(creator_id);

ALTER TABLE creator_followers ENABLE ROW LEVEL SECURITY;

-- Students can see who they follow, and creators can see who follows them
CREATE POLICY "View followers" ON creator_followers
  FOR SELECT USING (auth.uid() = student_id OR auth.uid() = creator_id);

-- Students can insert their own follows
CREATE POLICY "Insert followers" ON creator_followers
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can unfollow (delete)
CREATE POLICY "Delete followers" ON creator_followers
  FOR DELETE USING (auth.uid() = student_id);


-- COURSE ENROLLMENTS TABLE --
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON course_enrollments(course_id);

ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- Students can see their own enrollments, instructors can see enrollments for their courses
CREATE POLICY "View enrollments student" ON course_enrollments
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "View enrollments instructor" ON course_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = course_enrollments.course_id 
      AND courses.instructor_id = auth.uid()
    )
  );

-- Students can insert their own enrollments
CREATE POLICY "Insert enrollments" ON course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can unenroll (optional, delete)
CREATE POLICY "Delete enrollments" ON course_enrollments
  FOR DELETE USING (auth.uid() = student_id);
