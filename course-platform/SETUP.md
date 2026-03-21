# Course Platform - Setup & Features

A complete course learning platform built with Next.js, Tailwind CSS, and Supabase.

## Features Included

✅ **User Authentication** - Sign up, login, user profiles
✅ **Course Catalog** - Browse, search, and filter courses
✅ **Course Details** - Lessons, videos, descriptions
✅ **Progress Tracking** - Mark lessons complete, progress bars
✅ **Dashboard** - View enrolled courses and progress
✅ **Admin Panel** - Create and edit courses
✅ **Ratings & Reviews** - Rate and review courses
✅ **Discussion Forums** - Discussion threads for each course
✅ **Certificates** - Download certificates upon completion

## Setup Instructions

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Create Database Tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  level TEXT,
  instructor TEXT,
  rating FLOAT DEFAULT 0,
  students_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration INT,
  video_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress INT DEFAULT 0,
  status TEXT DEFAULT 'in-progress',
  enrolled_at TIMESTAMP DEFAULT now()
);

-- Lesson Progress table
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Forum Posts table
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  replies INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Forum Replies table
CREATE TABLE forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Certificates table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  issued_date TIMESTAMP DEFAULT now(),
  certificate_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

## Available Pages & Routes

- `/` - Home page
- `/signup` - User sign up
- `/login` - User login
- `/dashboard` - User dashboard (enrolled courses, progress)
- `/courses` - Course catalog (browse, search, filter)
- `/course/[id]` - Course details (lessons, reviews, forum, discussions)
- `/admin` - Admin panel (create/edit/delete courses)
- `/certificates` - View earned certificates

## File Structure

```
app/
├── signup/page.tsx          # Sign up page
├── login/page.tsx           # Login page
├── dashboard/page.tsx       # User dashboard
├── courses/page.tsx         # Course catalog & search
├── course/[id]/page.tsx     # Course details, lessons, reviews, forum
├── admin/page.tsx           # Admin panel for course management
├── certificates/page.tsx    # Certificates page
└── page.tsx                 # Home page

lib/
└── supabase.ts              # Supabase client configuration
```

## Next Steps

1. Set up your Supabase project
2. Copy your credentials to `.env.local`
3. Create the database tables using the SQL script above
4. Run `npm run dev` to start the app
5. Visit `http://localhost:3000` to begin using the platform

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Real-time DB, Auth)
- **Hosting**: Vercel (recommended)
