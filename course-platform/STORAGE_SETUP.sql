-- Create storage buckets for course materials
-- Note: Run this in the Supabase SQL editor

-- Create video bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-videos', 'course-videos', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Create materials bucket  
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-materials', 'course-materials', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Set up RLS policies for course-videos bucket
CREATE POLICY "Users can upload videos to their courses"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-videos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM courses WHERE instructor_id = auth.uid()
  )
);

CREATE POLICY "Users can view videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course-videos' AND (
    -- Allow course instructor
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM courses WHERE instructor_id = auth.uid()
    ) OR
    -- Allow enrolled students
    (storage.foldername(name))[1] IN (
      SELECT course_id::text FROM course_enrollments WHERE student_id = auth.uid()
    )
  )
);

-- Set up RLS policies for course-materials bucket
CREATE POLICY "Users can upload materials to their courses"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-materials' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM courses WHERE instructor_id = auth.uid()
  )
);

CREATE POLICY "Users can view materials"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course-materials' AND (
    -- Allow course instructor
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM courses WHERE instructor_id = auth.uid()
    ) OR
    -- Allow enrolled students
    (storage.foldername(name))[1] IN (
      SELECT course_id::text FROM course_enrollments WHERE student_id = auth.uid()
    )
  )
);
