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
      console.error(err)
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-black">Loading lesson...</div>
  if (!course || !lesson) return <div className="min-h-screen flex items-center justify-center text-black">Lesson not found</div>

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href={`/play/${courseId}`} className="text-blue-600 hover:underline font-semibold">
            ← Back to Curriculum
          </Link>
          <div className="text-gray-500 text-sm font-medium">Course: {course.title}</div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
          {/* Video Placeholder Area */}
          <div className="aspect-video bg-gray-900 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50"></div>
            <div className="text-white text-center relative z-10 p-8">
              <div className="text-7xl mb-6 drop-shadow-lg">▶️</div>
              <p className="font-bold text-2xl tracking-tight">Video Player Placeholder</p>
              <p className="text-gray-300 mt-3 font-medium">Lesson-specific video integration</p>
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-bold mb-6 tracking-wide uppercase">
              Lesson {lesson.number}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">{lesson.title}</h1>
            
            <div className="prose max-w-none text-gray-700 leading-relaxed bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200 shadow-inner">
              {lesson.description.split('\n').map((line, i) => (
                <p key={i} className="mb-4 last:mb-0 text-lg">{line}</p>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-between items-center">
            <Link 
              href={`/play/${courseId}/lesson/${lesson.number - 1}`} 
              className={`px-6 py-3 font-bold rounded-lg transition shadow-sm ${lesson.number > 1 ? 'bg-white text-gray-700 border hover:bg-gray-50 hover:text-blue-600' : 'opacity-50 cursor-not-allowed hidden'}`}
            >
              ← Previous Lesson
            </Link>
            <Link 
              href={`/play/${courseId}/lesson/${lesson.number + 1}`} 
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md ml-auto hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Next Lesson →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
