'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import VideoUpload from '@/components/VideoUpload'

interface Course {
  id: string
  title: string
  description: string
  video_url?: string
}

export default function CourseEditor() {
  const params = useParams()
  const courseId = params.id as string
  const router = useRouter()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      fetchCourse(session.user.id)
    }
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const fetchCourse = async (userId: string) => {
    try {
      const { data: courseData, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('instructor_id', userId)
        .single()

      if (error) {
        setLoading(false)
        return
      }

      if (courseData) {
        setCourse(courseData)
        setTitle(courseData.title || '')
        setDescription(courseData.description || '')
        setVideoUrl(courseData.video_url || '')
      }
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  const handleUpdateTextInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const { error } = await supabase
      .from('courses')
      .update({ title, description })
      .eq('id', courseId)
      
    if (error) {
      alert(`Failed to update fields: ${error.message}`)
    } else {
      alert('Text content saved!')
      setCourse(prev => prev ? { ...prev, title, description } : null)
    }
    setSaving(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold tracking-wide">Loading course configuration...</div>
  if (!course) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold tracking-wide">Course not found.</div>

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex justify-between items-center transition-all">
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-bold transition-colors">
            Back to Dashboard
          </Link>
          <div className="bg-blue-50 text-blue-800 font-extrabold px-5 py-2 rounded-full text-sm border border-blue-100 shadow-sm tracking-wide">
            {course.title}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 space-y-12 w-full flex-grow">
        
        {/* Core Details Editor */}
        <div className="bg-white p-10 md:p-14 rounded-2xl shadow-sm border border-gray-100 transition-all">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Course Text Content</h2>
            <p className="text-gray-500 font-medium text-lg mt-2">Modify the written payload for this module.</p>
          </div>
          
          <form onSubmit={handleUpdateTextInfo} className="space-y-8">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-blue-600/80 mb-3">Headlining Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 hover:bg-white transition-colors text-xl font-bold shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-blue-600/80 mb-3">Comprehensive Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 hover:bg-white transition-colors h-48 resize-none text-lg font-medium leading-relaxed shadow-sm block"
              />
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gray-900 text-white font-extrabold py-5 rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5 text-lg disabled:opacity-50"
              >
                {saving ? 'Saving Records...' : 'Save Text Fields'}
              </button>
            </div>
          </form>
        </div>

        {/* Video Upload Section */}
        <div className="bg-white p-10 md:p-14 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Media Payload</h2>
            <p className="text-gray-500 font-medium text-lg mt-2">Attach the primary video lecture for this course.</p>
          </div>
          <div className="pt-4">
              <VideoUpload
                courseId={courseId}
                currentVideoUrl={videoUrl}
                onVideoUploaded={(newUrl) => {
                  setVideoUrl(newUrl)
                  if (user && user.id) {
                    fetchCourse(user.id)
                  }
                }}
              />
          </div>
        </div>

      </div>
    </div>
  )
}
