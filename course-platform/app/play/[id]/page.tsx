'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  video_url?: string
}

export default function PlayCourse() {
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourse()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()

      if (error || !data) {
        setLoading(false)
        return
      }

      setCourse(data)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  const getEmbedUrl = (url: string) => {
     if (!url) return ''
     const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
     if (videoIdMatch && videoIdMatch[1]) {
       return `https://www.youtube.com/embed/${videoIdMatch[1]}`
     }
     return url
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium tracking-wide">Loading course content...</div>
  if (!course) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium tracking-wide">Course records not found.</div>

  const embedUrl = getEmbedUrl(course.video_url || '')

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex justify-between items-center transition-all">
          <Link href="/courses" className="text-gray-600 font-bold hover:text-blue-600 transition-colors flex items-center gap-2">
            <span>&larr;</span> Back to Student Catalog
          </Link>
          <div className="bg-gray-100 text-gray-800 font-extrabold px-5 py-2 rounded-full text-sm shadow-sm border border-gray-200">
            {course.title}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {course.video_url ? (
             <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden group border-b border-gray-100">
                {embedUrl.includes('youtube.com/embed') ? (
                  <iframe 
                    src={embedUrl} 
                    className="absolute inset-0 w-full h-full border-0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                ) : (
                  <a href={course.video_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-900 hover:bg-gray-800 transition-colors w-full h-full">
                    <div className="text-center text-white p-8">
                       <p className="font-extrabold text-2xl tracking-tight mb-6">View External Video</p>
                       <span className="bg-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">Open Media Link</span>
                    </div>
                  </a>
                )}
             </div>
          ) : (
             <div className="aspect-video bg-gray-900 flex items-center justify-center relative overflow-hidden border-b border-gray-100">
                <div className="text-center text-white p-8 opacity-50">
                   <p className="font-extrabold text-3xl tracking-tight mb-3">No Video Assigned</p>
                   <p className="text-gray-400 font-medium text-lg">This course is entirely text-based.</p>
                </div>
             </div>
          )}
          
          <div className="p-12 md:p-16 text-left bg-white">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-10 leading-tight tracking-tight">{course.title}</h1>
            
            <div className="prose max-w-none text-gray-700 leading-relaxed bg-gray-50 border border-gray-100 rounded-2xl p-10 md:p-12 shadow-inner">
              {course.description.split('\n').map((line, i) => (
                <p key={i} className="mb-6 last:mb-0 text-xl font-medium tracking-wide">{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
