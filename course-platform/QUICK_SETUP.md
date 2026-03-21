# ⚡ Quick Setup Checklist

## For Video Upload Feature to Work

### 1. **Supabase Storage Setup** (5 minutes)
- [ ] Copy SQL from `STORAGE_SETUP.sql`
- [ ] Go to Supabase Dashboard → SQL Editor
- [ ] Paste and run the SQL
- [ ] Verify two buckets created: `course-videos` and `course-materials`
- [ ] Check that both buckets are set to **Public** in Storage settings

### 2. **Test Video Upload**
- [ ] Go to `http://localhost:3000/dashboard`
- [ ] Create a test course (or use existing)
- [ ] Click **📹 Video** button
- [ ] Try linking a YouTube video (easier to test first)
- [ ] Verify video appears in preview

### 3. **YouTube Unlisted Video (Recommended)**
- [ ] Go to YouTube Studio
- [ ] Upload a test video
- [ ] Set visibility to **UNLISTED** (not Private)
- [ ] Copy the video URL
- [ ] Paste in course video upload
- [ ] Verify it displays in the course

---

## Features Now Available

✅ **Video Upload Component**
- Link YouTube/Vimeo videos (unlisted recommended)
- Upload MP4, WebM, Ogg files (max 2GB)
- Progress indicator during upload
- Video preview display

✅ **Dashboard Integration**
- "📹 Video" button on each course card
- Video upload modal
- Visual indicator for uploaded videos
- Framework link in navigation

✅ **Course Editor**
- VideoUpload component replaces old text input
- Better UX for video management
- Drag-and-drop support

---

## File Changes Made

```
✨ New Files Created:
├── components/VideoUpload.tsx          # Main video upload component
├── STORAGE_SETUP.sql                   # SQL for storage buckets
├── VIDEO_UPLOAD_GUIDE.md               # Detailed usage guide
└── YOUTUBE_UPLOAD_GUIDE.md             # YouTube setup guide

📝 Files Modified:
├── app/dashboard/page.tsx              # Added video upload modal
├── app/course/[id]/page.tsx            # Integrated VideoUpload component
└── components/CourseFramework.tsx      # Already created
```

---

## Quick Start Commands

### 1. Set Up Supabase Storage
```bash
# Run this SQL in Supabase → SQL Editor
# Copy from: STORAGE_SETUP.sql
```

### 2. Test the Feature
```
1. Go to Dashboard
2. Create a course
3. Click "📹 Video" button
4. Paste a YouTube URL (set to Unlisted)
5. Click "Save Video URL"
6. See the preview appear
```

---

## Environment Variables

Make sure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Support Resources

📚 **Documentation:**
- [VIDEO_UPLOAD_GUIDE.md](VIDEO_UPLOAD_GUIDE.md) - Full feature guide
- [YOUTUBE_UPLOAD_GUIDE.md](YOUTUBE_UPLOAD_GUIDE.md) - YouTube setup
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)

🎥 **Video Platforms:**
- [YouTube Studio](https://studio.youtube.com)
- [Vimeo Upload](https://vimeo.com/upload)

---

## Troubleshooting

**Issue: "Bucket not found"**
→ Run STORAGE_SETUP.sql in Supabase

**Issue: Video upload fails**
→ Check if bucket is Public
→ Verify file size < 2GB
→ Check browser console (F12)

**Issue: YouTube video doesn't show**
→ Make sure video is UNLISTED (not Private)
→ Check URL format: youtube.com/watch?v=...

---

## Next Steps

1. ✅ Run STORAGE_SETUP.sql
2. ✅ Test video upload feature
3. ✅ Create courses with videos
4. ✅ Follow the 10-lesson framework
5. ✅ Share with students!

---

**🎉 You're ready to build courses with videos!**
