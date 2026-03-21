'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { courseFramework } from '@/components/CourseFramework'

interface Course {
  id: string
  title: string
  description: string
  video_url?: string
  framework?: string // stored as JSON
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })
  const router = useRouter()

  useEffect(() => {
    // ensure we know the authenticated user before doing anything
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      await fetchCourses()
      setLoading(false)
    }
    init()
  }, [router])

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')

    if (!error && data) {
      setCourses(data)
    }
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    // ensure we have a logged-in user before inserting
    if (!user || !user.id) {
      console.error('Cannot create course: user not found')
      return
    }

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
              title: formData.title,
          description: formData.description,
          instructor_id: user.id,
          framework: JSON.stringify(courseFramework),
        })
        .select()

      if (error) throw error

      if (data && data.length) {
        setCourses([...courses, data[0]])
      }
      setFormData({ title: '', description: '' })
      setShowForm(false)
    } catch (error: unknown) {
      console.error('Error creating course:', (error as Error).message)
    }
  }



  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/framework" className="text-blue-600 hover:underline font-semibold">
              📚 View Framework
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-600">Welcome, {user?.email}</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={!user}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {showForm ? 'Cancel' : 'Create Course'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-8 rounded-lg shadow mb-8">
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 text-black"
                  placeholder="Describe your course"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Create Course
              </button>
            </form>
          </div>
        )}

        <div>
          <h3 className="text-xl font-bold mb-4 text-blue-400">Your Courses ({courses.length})</h3>
          
          {courses.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600">No courses created yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                  <h4 className="text-lg font-bold mb-2">{course.title}</h4>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  {course.video_url && (
                    <div className="mb-4 p-2 bg-green-50 rounded border border-green-200">
                      <p className="text-xs text-green-700 font-semibold">✓ Video added</p>
                    </div>
                  )}
                  <Link
                    href={`/course/${course.id}`}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Edit Course →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
