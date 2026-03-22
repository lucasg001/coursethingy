'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  instructor_id: string
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user || null
      setUser(currentUser)
      
      const { data, error } = await supabase.from('courses').select('*')
      
      if (!error && data) {
         setCourses(data)
      }
      setLoading(false)
    }
    
    init()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex justify-between items-center transition-all">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-900 hover:text-blue-700 transition-colors">
            Course Platform
          </Link>
          <div className="flex gap-4 items-center">
             <Link href="/dashboard" className="px-5 py-2.5 rounded-lg bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm border border-transparent hover:border-gray-200">
               Creator Studio
             </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-14 border-b border-gray-200 pb-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">Student Catalog</h1>
            <p className="text-xl text-gray-500 font-medium mt-3">Discover and learn from modules published by other users.</p>
          </div>
          <div className="bg-white px-5 py-2 rounded-xl border border-gray-200 shadow-sm">
             <span className="font-extrabold text-gray-400 text-sm uppercase tracking-widest block mb-1">Status</span>
             <span className="font-bold text-gray-900">{user ? 'Signed In' : 'Browsing Anonymously'}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-bold text-xl tracking-wide">Scanning database for content...</div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-24 text-center">
            <h3 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">No content found</h3>
            <p className="text-xl text-gray-500 font-medium">There are no external courses available on the platform right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Link key={course.id} href={`/play/${course.id}`} className="group h-full">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full flex flex-col">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-56 w-full group-hover:scale-105 transition-transform duration-500 relative flex items-center justify-center">
                    <span className="text-white font-extrabold text-2xl opacity-40 tracking-widest uppercase">Video Module</span>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-8 md:p-10 flex-grow flex flex-col relative bg-white">
                    <div className="absolute -top-6 left-8 bg-white p-1 rounded-full shadow-sm">
                       <div className="bg-blue-50 text-blue-700 font-extrabold rounded-full w-10 h-10 flex items-center justify-center shadow-inner">
                         <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                       </div>
                    </div>
                    <div className="flex justify-between items-start mt-4 mb-4">
                       <h3 className="font-extrabold text-2xl text-gray-900 tracking-tight line-clamp-2 leading-snug pr-2">{course.title}</h3>
                       {user?.id === course.instructor_id && (
                         <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm border border-green-200">Yours</span>
                       )}
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 flex-grow font-medium">{course.description}</p>
                    <div className="mt-auto pt-6 border-t border-gray-100">
                      <span className="text-blue-600 font-bold bg-blue-50 px-4 py-3.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 w-full text-center block shadow-sm border border-blue-100 group-hover:border-transparent">
                        Take this course
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
