'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Phase } from '@/components/CourseFramework'

export default function PlayCourse() {
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState<any>(null)
  const [framework, setFramework] = useState<Phase[]>([])
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
        console.error('Fetch course error:', error)
        setLoading(false)
        return
      }

      setCourse(data)
      if (data.framework) {
        setFramework(JSON.parse(data.framework))
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-black">Loading course...</div>
  if (!course) return <div className="min-h-screen flex items-center justify-center text-black">Course not found</div>

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/courses" className="text-blue-600 hover:underline font-semibold">
            ← Explore Courses
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow mb-8 text-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white leading-relaxed">
          <h2 className="text-4xl font-extrabold mb-4">{course.title}</h2>
          <p className="text-xl opacity-90">{course.description}</p>
        </div>

        <h3 className="text-2xl font-bold mb-6 text-gray-900">Course Curriculum</h3>
        <div className="space-y-6">
          {framework.map((phase, pIdx) => (
            <div key={pIdx} className="border rounded-lg bg-white shadow-sm overflow-hidden border-gray-200">
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{phase.title}</h4>
                  <p className="text-sm text-gray-600 font-medium">{phase.subtitle}</p>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {phase.lessons.map((lesson, lIdx) => (
                  <Link 
                    key={lIdx} 
                    href={`/play/${courseId}/lesson/${lesson.number}`}
                    className="block px-6 py-4 hover:bg-blue-50 transition flex justify-between items-center group"
                  >
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition">Lesson {lesson.number}: {lesson.title}</h5>
                      <p className="text-sm text-gray-600 line-clamp-2">{lesson.description}</p>
                    </div>
                    <div className="text-blue-600 bg-blue-100 px-4 py-2 rounded-full text-sm font-bold ml-4 whitespace-nowrap group-hover:bg-blue-600 group-hover:text-white transition">
                      Start →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
