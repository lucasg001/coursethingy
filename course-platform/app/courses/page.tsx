'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCourses = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('courses').select('*')

    if (!error) {
      setCourses(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCourses()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Courses</h1>

        {loading ? (
          <div className="text-center py-12">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No courses found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} href={`/play/${course.id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer h-full">
                  <div className="bg-blue-500 h-40"></div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
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
