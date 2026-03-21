# 🎬 Video Upload Flow Diagram

## User Journey

```
USER STARTS AT DASHBOARD
         ↓
    [My Courses]
         ↓
    Course Cards Grid
    ├─ Course Title
    ├─ Description
    ├─ ✓ Video uploaded (if exists)
    └─ [Edit Course] [📹 Video]
         ↓
    CLICK [📹 Video]
         ↓
    Video Upload Modal Opens
         ↓
         ├─→ [Link YouTube/Vimeo] ←─┐
         │                          │
         │  Option A: URL Input     │
         │  ┌─────────────────────┐ │
         │  │ Paste Video URL     │ │
         │  │ https://youtube.... │ │
         │  │                     │ │
         │  │ [Save Video URL]    │ │
         │  └─────────────────────┘ │
         │           ↓              │
         │  Video Saved!            │
         │  Shows in preview        │
         │                          │
         └─→ [Upload Video File] ←─┤
                                   │
            Option B: File Upload  │
            ┌──────────────────────┐│
            │ Drag/Drop or Click   ││
            │ ┌──────────────────┐ ││
            │ │  🎥 Select File  │ ││
            │ │  MP4/WebM/Ogg    │ ││
            │ │  Max 2GB         │ ││
            │ └──────────────────┘ ││
            │      ↓               ││
            │ [Upload Progress]    ││
            │ █████░░░░ 50%        ││
            │      ↓               ││
            │ Video Uploaded!      ││
            │ Shows in preview     ││
            └──────────────────────┘│
                     ↓              │
            ✅ Modal Closes         │
            ✅ Dashboard Refreshes  │
            ✅ Video shows in card  │
                     ↓
            BACK TO DASHBOARD
            Course now has video!
```

---

## Component Architecture

```
Dashboard Page
├── Header
│   ├── "My Courses" Title
│   ├── Framework Link (📚)
│   └── Logout Button
│
├── Create Course Section
│   └── Course Creation Form
│
├── Video Upload Modal (conditional)
│   └── VideoUpload Component
│       ├── Mode Selector
│       │   ├─ URL Input
│       │   └─ File Upload
│       └── Video Preview
│
└── Courses Grid
    ├── Course Card
    │   ├── Title
    │   ├── Description
    │   ├── Upload Status (conditional)
    │   ├── Edit Course Link
    │   └── 📹 Video Button
    ├── Course Card
    ├── Course Card
    └── ...

Course Editor Page
├── Header (Course Title + Back)
├── VideoUpload Component
│   ├── YouTube/Vimeo Input
│   ├── File Upload
│   └── Preview
├── Checkpoints Section
└── PDF Upload Section

Framework Page
├── Header + Framework Link
├── Phase 1 (Green - The Start)
│   ├── Lesson 1: The Promise
│   ├── Lesson 2: The Fast Win
│   └── Lesson 3: The Gear List
├── Phase 2 (Amber - The Meat)
│   ├── Lesson 4-7: Deep Dives
├── Phase 3 (Red - The Pro Secrets)
│   ├── Lesson 8-10: Advanced
└── Quick Reference
```

---

## Data Flow

```
VideoUpload Component
     ↓
    User Selects Input Method
     ↓
     ├─→ YouTube/Vimeo URL
     │        ↓
     │   [Save Video URL]
     │        ↓
     │   Save to Supabase
     │   courses.video_url = "https://..."
     │        ↓
     │   onVideoUploaded Callback
     │        ↓
     │   Dashboard Refreshes
     │        ↓
     │   Show preview & status
     │
     └─→ File Upload
            ↓
        User Selects File
            ↓
        Upload to Supabase Storage
        /course-videos/{courseId}/{timestamp}_{filename}
            ↓
        Get Public URL
            ↓
        Save Public URL to DB
        courses.video_url = "https://storage.supabase.co/..."
            ↓
        onVideoUploaded Callback
            ↓
        Dashboard Refreshes
            ↓
        Show preview & status
```

---

## Database Structure

```
courses table
┌──────────────────────────────┐
│ id (UUID)                    │
│ instructor_id (UUID)         │ ← FK to auth.users
│ title (TEXT)                 │
│ description (TEXT)           │
│ video_url (TEXT) ← NEW/USED  │ ← Stores URL or storage path
│ checkpoints (JSONB)          │
│ pdfs (JSONB)                 │
│ created_at (TIMESTAMP)       │
│ updated_at (TIMESTAMP)       │
└──────────────────────────────┘

Supabase Storage
┌─ course-videos bucket (PUBLIC)
│  └─ {courseId}/
│     ├─ 1234567890_video1.mp4
│     └─ 1234567892_video2.mp4
│
└─ course-materials bucket (PUBLIC)
   └─ {courseId}/
      └─ 1234567890_document.pdf
```

---

## User Actions & States

### Dashboard State Flow

```
INITIAL STATE
├── loading: true
├── courses: []
├── showForm: false
├── showVideoUpload: false

USER CLICKS "Create Course"
├── showForm: true
│
USER FILLS FORM & SUBMITS
├── New course created
├── setCourses([...courses, newCourse])
├── showForm: false
│
USER CLICKS "📹 Video" BUTTON
├── showVideoUpload: true
├── selectedCourseId: course.id
│
USER UPLOADS VIDEO
├── VideoUpload saves to DB
├── onVideoUploaded() called
├── showVideoUpload: false
├── fetchCourses() refreshes list
├── Course card now shows "✓ Video uploaded"

FINAL STATE
├── Courses display with video status
├── Videos playable in preview
├── Ready to continue editing
```

---

## Video Upload Methods Comparison

```
┌──────────────────┬────────────┬──────────┬─────────────┐
│ Method           │ Setup Time │ Storage  │ Privacy     │
├──────────────────┼────────────┼──────────┼─────────────┤
│ YouTube URL      │ 5 min      │ YouTube  │ Unlisted OK │
│ (Recommended)    │            │          │             │
├──────────────────┼────────────┼──────────┼─────────────┤
│ Vimeo URL        │ 5 min      │ Vimeo    │ Good        │
├──────────────────┼────────────┼──────────┼─────────────┤
│ Direct Upload    │ Variable   │ Platform │ Very Good   │
│ (MP4/WebM/Ogg)   │            │          │             │
└──────────────────┴────────────┴──────────┴─────────────┘
```

---

## 10-Lesson Framework Structure

```
Phase 1: The Start (Green 🟢)
│
├─ Lesson 1: The Promise
│  └─ 2-min welcome video
│     Explain what they'll learn
│     Why you're the teacher
│
├─ Lesson 2: The Fast Win
│  └─ One small achievable task
│     Show progress immediately
│
└─ Lesson 3: The Gear/Tool List
   └─ List every tool you use
      No gatekeeping!

Phase 2: The Meat (Amber 🟡)
│
├─ Lesson 4: The Roadmap
│  └─ High-level process overview
│     "The 3 steps I use..."
│
├─ Lesson 5: Deep Dive (Step 1)
│  └─ Beginning of process
│     Show screen/hands
│
├─ Lesson 6: Deep Dive (Step 2)
│  └─ Middle of process
│     Where people get stuck
│
└─ Lesson 7: Deep Dive (Step 3)
   └─ Finishing & polishing
      Complete the work

Phase 3: Pro Secrets (Red 🔴)
│
├─ Lesson 8: Don't Do This
│  └─ 3 biggest mistakes
│     Skip the pain
│
├─ Lesson 9: The Shortcut
│  └─ Templates/scripts/cheat sheets
│     10x faster process
│
└─ Lesson 10: Graduation
   └─ What's next?
      Keep momentum going
```

---

## Key Features At a Glance

```
✨ FEATURES

VideoUpload Component:
├─ YouTube/Vimeo linking
├─ File upload (MP4/WebM/Ogg)
├─ Max 2GB file size
├─ Upload progress indicator
├─ Video preview display
├─ Drag & drop support
└─ Responsive design

Dashboard:
├─ Video upload modal
├─ Course video cards
├─ Video status indicator
├─ Framework link
└─ Quick video access

Course Editor:
├─ Integrated VideoUpload
├─ Video management
├─ Easy upload/update
├─ Preview display
└─ Professional UI

Security:
├─ Row Level Security (RLS)
├─ User isolation
├─ File validation
├─ URL validation
└─ Organized storage

Documentation:
├─ Complete guides
├─ YouTube setup steps
├─ Troubleshooting
├─ Best practices
└─ Quick reference
```

---

## Next Steps for Users

1. ✅ Run STORAGE_SETUP.sql
2. ✅ Create first course
3. ✅ Upload YouTube video (unlisted)
4. ✅ Follow 10-lesson framework
5. ✅ Build complete course
6. ✅ Share with students
7. ✅ Expand to more courses

---

**Happy course building!** 🎉
