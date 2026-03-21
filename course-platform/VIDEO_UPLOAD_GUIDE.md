# Video Upload Feature Guide

## Overview
Users can now upload videos to their courses in two ways:
1. **Link External Video** - Add a YouTube or Vimeo URL (unlisted videos recommended)
2. **Upload Video File** - Upload MP4, WebM, or Ogg files directly to Supabase Storage

## Setup Instructions

### 1. Create Storage Buckets in Supabase

Run the SQL from `STORAGE_SETUP.sql` in your Supabase dashboard:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Create a new query
3. Copy the contents of `STORAGE_SETUP.sql`
4. Run the query

This creates two storage buckets:
- `course-videos` - For uploaded video files
- `course-materials` - For PDF materials

### 2. Enable Storage in Supabase

Make sure both buckets are set to **public** in Supabase:

1. Go to **Storage** in Supabase dashboard
2. For each bucket (`course-videos`, `course-materials`):
   - Click the bucket name
   - Click **Settings**
   - Make sure "Make bucket public" is enabled

## Usage

### For Instructors

#### Option 1: Link YouTube/Vimeo Video (Recommended for quick setup)

1. From Dashboard, click the **📚 View Framework** link
2. Or navigate to any course and click the **📹 Video** button
3. Select **Link YouTube/Vimeo**
4. Paste your video URL
5. Click **Save Video URL**

**Important for YouTube:**
- Use **Unlisted** videos (not private)
- Unlisted videos can be shared via link without making them public
- Go to YouTube → Video settings → Visibility → "Unlisted"

#### Option 2: Upload Video File

1. From Dashboard or course page, click **📹 Video** button
2. Select **Upload Video File**
3. Click the upload area and select a video file
4. Supported formats: MP4, WebM, Ogg
5. Maximum file size: 2GB
6. Wait for upload to complete

### Video Status

- Once uploaded, each course card shows **✓ Video uploaded** indicator
- Course editors can preview videos in the video upload component

## File Structure

```
components/
├── VideoUpload.tsx          # Main video upload component
├── CourseFramework.tsx      # Framework display component

app/
├── dashboard/
│   └── page.tsx             # Updated with video upload modal
├── course/
│   └── [id]/
│       └── page.tsx         # Updated with VideoUpload component
└── framework/
    └── page.tsx             # Framework viewer page
```

## Features

✨ **Video Upload Component** (`VideoUpload.tsx`)
- Supports URL input for YouTube/Vimeo
- File upload with drag-and-drop
- Upload progress indicator
- Video preview display
- Responsive design

🎯 **Dashboard Integration**
- Video upload modal on demand
- Visual indicator for uploaded videos
- Quick access to video upload from course cards
- Framework link in navigation

## Supabase Configuration

### Database Schema
The `courses` table includes:
```sql
video_url TEXT     -- Stores video URL or uploaded file public URL
```

### Storage Rules
RLS policies ensure:
- Users can only upload to their own courses
- Videos are publicly viewable
- Files are organized by course ID

## Troubleshooting

### Upload fails with "bucket not found"
→ Make sure you ran the SQL from `STORAGE_SETUP.sql`
→ Check that buckets exist and are public in Supabase

### Video doesn't appear after upload
→ Check browser console for errors (F12)
→ Verify the video URL was saved to the database
→ Make sure the bucket is set to public

### YouTube video won't embed
→ Use **Unlisted** (not Private) videos
→ Check the video privacy settings
→ Verify the YouTube video allows embedding

### File upload is slow
→ Check your internet connection
→ For large files (>500MB), consider compression
→ Try uploading during off-peak hours

## Best Practices

### For YouTube/Vimeo
1. Upload to YouTube/Vimeo first
2. Set video to **Unlisted** (if YouTube)
3. Copy the video URL
4. Paste into the course platform

### For Direct Upload
1. Compress videos before uploading (recommended < 500MB)
2. Use MP4 format for best compatibility
3. Upload during off-peak hours for reliability
4. Keep file names descriptive

### Course Structure
Follow the 10-lesson framework:
- Lesson 1-3: The Start (Hook)
- Lesson 4-7: The Meat (How-To)
- Lesson 8-10: The Pro Secrets (Value)

Each lesson can have its own video.

## API Reference

### VideoUpload Component Props

```tsx
interface VideoUploadProps {
  courseId: string           // Required: Course ID
  onVideoUploaded?: (videoUrl: string) => void  // Callback when video uploaded
  currentVideoUrl?: string   // Optional: Current video URL to display
}
```

### Usage Example

```tsx
import VideoUpload from '@/components/VideoUpload'

<VideoUpload
  courseId={course.id}
  currentVideoUrl={course.video_url}
  onVideoUploaded={(url) => {
    // Handle video upload completion
  }}
/>
```
