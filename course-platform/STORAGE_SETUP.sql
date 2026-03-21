-- Create storage buckets for course materials
-- Note: Run this in the Supabase SQL editor

-- Create video bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-videos', 'course-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create materials bucket  
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-materials', 'course-materials', true)
ON CONFLICT (id) DO NOTHING;

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
USING (bucket_id = 'course-videos');

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
USING (bucket_id = 'course-materials');
