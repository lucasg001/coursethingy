'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Phase } from '@/components/CourseFramework'

export default function PlayLesson() {
  const params = useParams()
  const courseId = params.id as string
  const lessonNumberStr = params.lessonNumber as string
  const lessonNumber = parseInt(lessonNumberStr, 10)
  
  const [course, setCourse] = useState<any>(null)
  const [framework, setFramework] = useState<Phase[]>([])
  const [lesson, setLesson] = useState<{number: number, title: string, description: string} | null>(null)
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
      if (data.framework) {
        const parsed: Phase[] = JSON.parse(data.framework)
        setFramework(parsed)
        
        for (const phase of parsed) {
          const foundLesson = phase.lessons.find(l => l.number === lessonNumber)
          if (foundLesson) {
            setLesson(foundLesson)
            break
          }
        }
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Loading session...</div>
  if (!course || !lesson) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Session records missing.</div>

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex justify-between items-center transition-all">
          <Link href={`/play/${courseId}`} className="text-gray-600 font-bold hover:text-blue-600 transition-colors">
            Back to Curriculum
          </Link>
          <div className="text-gray-800 text-sm font-extrabold bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200">
            {course.title}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Video Placeholder Area */}
          <div className="aspect-video bg-gray-900 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 opacity-80 group-hover:opacity-90 transition-opacity"></div>
            <div className="text-white text-center relative z-10 p-8 transform group-hover:scale-105 transition-transform duration-500">
              <div className="w-20 h-20 mx-auto border-4 border-white/80 rounded-full flex items-center justify-center mb-6 pl-2 shadow-2xl backdrop-blur-sm bg-white/5">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent drop-shadow-md"></div>
              </div>
              <p className="font-extrabold text-2xl tracking-tight text-white/90">Media Player Standby</p>
              <p className="text-gray-400 mt-2 font-medium tracking-wide">Awaiting lesson video source integration</p>
            </div>
          </div>
          
          <div className="p-10 md:p-12 border-b border-gray-100 text-center md:text-left">
            <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-100 text-blue-800 rounded-full text-xs font-extrabold mb-6 tracking-widest uppercase shadow-sm">
              Module {lesson.number}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">{lesson.title}</h1>
            
            <div className="prose max-w-none text-gray-700 leading-relaxed bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-inner text-left">
              {lesson.description.split('\n').map((line, i) => (
                <p key={i} className="mb-4 last:mb-0 text-lg font-medium">{line}</p>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 px-10 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-2xl">
            <Link 
              href={`/play/${courseId}/lesson/${lesson.number - 1}`} 
              className={`w-full sm:w-auto text-center px-8 py-4 font-bold rounded-xl transition-all shadow-sm ${lesson.number > 1 ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-blue-600 hover:shadow-md' : 'opacity-0 pointer-events-none hidden'}`}
            >
              Previous Module
            </Link>
            <Link 
              href={`/play/${courseId}/lesson/${lesson.number + 1}`} 
              className="w-full sm:w-auto text-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5 sm:ml-auto"
            >
              Continue to Next Module
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
