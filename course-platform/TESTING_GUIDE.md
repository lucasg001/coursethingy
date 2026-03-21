# 🧪 Testing Guide for Video Upload Feature

## Quick Test Scenarios

### Scenario 1: Link YouTube Video (Easiest Test)

**Setup:**
1. Have YouTube video ID ready
2. Make sure video is set to UNLISTED

**Steps:**
1. Go to `http://localhost:3000/dashboard`
2. Click "📹 Video" on any course
3. Select "Link YouTube/Vimeo"
4. Enter: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
5. Click "Save Video URL"
6. Verify preview shows video player

**Expected Result:**
- ✅ Preview displays
- ✅ Video URL saved to database
- ✅ Dashboard shows "✓ Video uploaded"

---

### Scenario 2: Upload Test Video File

**Setup:**
1. Have a small test video ready (MP4 format)
2. File should be < 100MB for quick testing

**Steps:**
1. Go to `http://localhost:3000/dashboard`
2. Click "📹 Video" on any course
3. Select "Upload Video File"
4. Click upload area and select video
5. Wait for upload to complete
6. Verify preview shows video player

**Expected Result:**
- ✅ Progress indicator shows
- ✅ Upload completes successfully
- ✅ Video displays in preview
- ✅ Dashboard shows "✓ Video uploaded"

---

### Scenario 3: Course Editor Integration

**Setup:**
1. Have a course created with/without video

**Steps:**
1. Go to Dashboard
2. Click "Edit Course" on any course
3. Scroll to video section
4. Use VideoUpload component
5. Add or update video
6. Verify preview updates

**Expected Result:**
- ✅ VideoUpload component displays
- ✅ Can link URL or upload file
- ✅ Video persists in database
- ✅ Preview shows correctly

---

## Test Video URLs

### Public Test Videos (Unlisted YouTube)

Use these for testing:

```
🎥 Standard Test Video:
https://www.youtube.com/watch?v=jNQXAC9IVRw

🎥 Big Buck Bunny:
https://www.youtube.com/watch?v=aqz-KE-bpKQ

🎥 Sample Video (Vimeo):
https://vimeo.com/90509568
```

**Note:** These are public videos. For production, use your own unlisted videos.

---

## How to Create Test Videos

### Option 1: Use Sample Video from Web

```bash
# Download sample video
wget https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4

# Use this file for upload testing
```

### Option 2: Create Quick Test Video

**Using FFmpeg (if installed):**
```bash
# Create 10-second test video
ffmpeg -f lavfi -i testsrc=duration=10:size=320x240:rate=1 \
        -f lavfi -i sine=frequency=1000:duration=10 \
        test-video.mp4
```

**Using OBS (Open Broadcaster Software):**
1. Open OBS
2. Set small resolution (640x480)
3. Record 10 seconds
4. Export as MP4

### Option 3: Record Your Screen

**Windows:**
- Use Windows Game Bar (Win + G)
- Record 10 seconds of your screen

**Mac:**
- Use QuickTime (Cmd + Shift + 5)
- Record 10 seconds

---

## Validation Checklist

### Before Testing

- [ ] Supabase project set up
- [ ] STORAGE_SETUP.sql executed
- [ ] Buckets created and set to Public
- [ ] Environment variables configured
- [ ] Dev server running (npm run dev)
- [ ] Test video ready (if testing upload)

### During Testing

- [ ] Dashboard loads without errors
- [ ] Video upload modal opens
- [ ] Mode toggle works (URL ↔ File)
- [ ] URL input accepts valid URLs
- [ ] File input accepts video files
- [ ] Upload progress shows
- [ ] Preview displays video
- [ ] Database saves video URL
- [ ] Course card shows upload status

### After Testing

- [ ] Refresh page - video still shows
- [ ] Navigate away - data persists
- [ ] Edit course - video appears
- [ ] Browser console - no errors
- [ ] Network tab - files uploading correctly

---

## Common Test Cases

### Test Case 1: Valid YouTube URL
```
Input: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Expected: Video preview displays, saved to DB
Status: PASS ✅ / FAIL ❌
```

### Test Case 2: Valid Vimeo URL
```
Input: https://vimeo.com/90509568
Expected: Video preview displays, saved to DB
Status: PASS ✅ / FAIL ❌
```

### Test Case 3: Invalid URL
```
Input: https://invalid-url-example.com/video
Expected: Error message, not saved
Status: PASS ✅ / FAIL ❌
```

### Test Case 4: MP4 File Upload
```
Input: test-video.mp4 (10MB)
Expected: Uploads successfully, preview plays
Status: PASS ✅ / FAIL ❌
```

### Test Case 5: Large File (>2GB)
```
Input: large-video.mp4 (2.5GB)
Expected: Error message, not uploaded
Status: PASS ✅ / FAIL ❌
```

### Test Case 6: Invalid File Type
```
Input: document.pdf
Expected: Error message, not uploaded
Status: PASS ✅ / FAIL ❌
```

### Test Case 7: Empty Upload
```
Input: No file selected
Expected: No action taken
Status: PASS ✅ / FAIL ❌
```

### Test Case 8: Data Persistence
```
Steps:
1. Upload video
2. Navigate to dashboard
3. Go to course editor
4. Reload page
Expected: Video still appears in all locations
Status: PASS ✅ / FAIL ❌
```

---

## Debugging Tips

### Check Browser Console (F12)
```javascript
// Look for:
- JavaScript errors
- Network errors
- Fetch failures
- Console warnings
```

### Check Network Tab
```
Look for:
- Storage upload requests (PUT /storage/v1)
- Database update requests (POST /rest/v1)
- Response status codes
- Response sizes
```

### Check Supabase Logs
```
1. Go to Supabase Dashboard
2. Project → Logs
3. Look for API calls
4. Check for errors
5. Verify RLS policies applied
```

### Test Supabase Connection
```javascript
// In browser console:
const { supabase } = await import('@/lib/supabase')
console.log('Supabase:', supabase)
console.log('Auth:', await supabase.auth.getSession())
```

---

## Performance Testing

### Upload Speed Test
```
File Size    Expected Time    Actual Time    Status
1MB          < 1s            ___________    ✅/❌
10MB         < 5s            ___________    ✅/❌
50MB         < 15s           ___________    ✅/❌
100MB        < 30s           ___________    ✅/❌
```

### Preview Load Time
```
Type          Expected Time    Actual Time    Status
YouTube       Instant         ___________    ✅/❌
Vimeo         Instant         ___________    ✅/❌
Uploaded MP4  < 1s            ___________    ✅/❌
```

---

## Integration Testing

### Test with Framework Page
```
1. Go to /framework
2. See 10-lesson structure
3. Click back to dashboard
4. Upload video for Lesson 1
5. Verify video persists
Expected: Framework + Videos work together
```

### Test Full Course Creation Flow
```
1. Dashboard → Create Course
2. Fill in title & description
3. Create course
4. Click 📹 Video
5. Upload/link video
6. View course
7. See video in preview
Expected: Complete course with video
```

---

## Rollback Plan (If Issues)

If testing reveals issues:

### Remove VideoUpload from Dashboard
- Edit: `app/dashboard/page.tsx`
- Remove: Video upload modal section
- Keep: Course creation form

### Revert to Simple URL Input
- Edit: `app/course/[id]/page.tsx`
- Remove: VideoUpload component import
- Add back: Simple text input for URL

### Drop Storage Buckets
```sql
-- In Supabase SQL Editor:
DROP BUCKET IF EXISTS course-videos CASCADE;
DROP BUCKET IF EXISTS course-materials CASCADE;
```

---

## Success Criteria

✅ All features tested and working:
- [ ] YouTube URL linking works
- [ ] Vimeo URL linking works
- [ ] File upload works (MP4)
- [ ] Progress indicator shows
- [ ] Preview displays
- [ ] Database persists data
- [ ] Dashboard shows status
- [ ] Course editor integration works
- [ ] No console errors
- [ ] Mobile responsive

✅ Performance acceptable:
- [ ] Upload < 30s for 100MB
- [ ] Preview loads instantly
- [ ] No page freezing

✅ Security verified:
- [ ] File validation working
- [ ] URL validation working
- [ ] Database RLS policies applied
- [ ] Files properly organized

---

## Test Report Template

```
Test Session: _______________
Date: _______________
Tester: _______________

Feature: Video Upload
Component: VideoUpload.tsx
Pages: Dashboard, Course Editor

TEST RESULTS:
├─ YouTube URL: ✅/❌
├─ Vimeo URL: ✅/❌
├─ File Upload: ✅/❌
├─ Preview: ✅/❌
├─ Database: ✅/❌
├─ Dashboard Status: ✅/❌
├─ Integration: ✅/❌
└─ Performance: ✅/❌

Issues Found:
1. _______________
2. _______________
3. _______________

Overall Status: PASS ✅ / FAIL ❌

Sign-off: _______________
```

---

## Recommended Test Order

1. **Basic Functionality**
   - Test YouTube URL linking
   - Test file upload

2. **Edge Cases**
   - Test invalid URLs
   - Test oversized files
   - Test invalid file types

3. **Integration**
   - Test with framework
   - Test with course editor
   - Test with dashboard

4. **Performance**
   - Test upload speeds
   - Test preview loads
   - Test data persistence

5. **Security**
   - Verify file validation
   - Verify URL validation
   - Check database policies

---

**Happy Testing! 🧪**
