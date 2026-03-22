'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  video_url?: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '' })
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      await fetchCourses(session.user.id)
      setLoading(false)
    }
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const fetchCourses = async (userId: string) => {
    const { data, error } = await supabase.from('courses').select('*').eq('instructor_id', userId)
    if (!error && data) setCourses(data)
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !user.id) return

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: formData.title,
          description: formData.description,
          instructor_id: user.id,
          framework: '[]'
        })
        .select()

      if (error) {
        alert(`Failed to create: ${error.message}`)
        throw error
      }

      if (data && data.length) {
        setCourses([...courses, data[0]])
        router.push(`/course/${data[0].id}`)
      }
    } catch (error: unknown) {
      console.error('Error creating course:', (error as Error).message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium tracking-wide">Initializing dashboard...</div>

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex justify-between items-center transition-all">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-900 hover:text-blue-700 transition-colors">
            Course Platform
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/courses" className="text-gray-600 font-bold hover:text-blue-600 transition-colors mr-6">
              Student Catalog
            </Link>
            <button 
              onClick={handleLogout}
              className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 gap-6 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Creator Dashboard</h2>
            <p className="text-lg text-gray-500 font-medium mt-2">Manage and publish your video courses.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={!user}
            className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
          >
            {showForm ? 'Cancel Form' : '+ New Blank Course'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 mb-12 transform transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">Course Foundation</h3>
            <form onSubmit={handleCreateCourse} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 whitespace-nowrap uppercase tracking-widest text-blue-600/80">Subject Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 hover:bg-white transition-colors font-bold text-lg shadow-sm"
                  placeholder="E.g., Master Advanced TypeScript"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 whitespace-nowrap uppercase tracking-widest text-blue-600/80">Core Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 hover:bg-white transition-colors h-40 resize-none font-medium text-lg leading-relaxed shadow-sm"
                  placeholder="What will students learn in this single-video course?"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-extrabold py-5 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                >
                  Create & Continue to Video Upload
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <h3 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-8 border-b border-gray-200 pb-5">
            Your Active Courses <span className="ml-3 bg-gray-100 border border-gray-200 text-gray-700 rounded-full px-4 py-1.5 text-sm">{courses.length}</span>
          </h3>
          
          {courses.length === 0 ? (
            <div className="bg-white p-20 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-2xl text-gray-900 font-extrabold tracking-tight mb-2">No Courses Created</p>
              <p className="text-lg text-gray-500 font-medium">Click the button above to start your first text + video course.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-8 flex flex-col h-full group border-2 border-transparent hover:border-blue-100">
                  <h4 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-3 line-clamp-2 leading-snug">{course.title}</h4>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3 flex-grow">{course.description}</p>
                  
                  {course.video_url && (
                    <div className="mb-8 inline-flex">
                      <span className="bg-green-50 text-green-700 border border-green-200 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm">
                        Video Linked
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <Link
                      href={`/course/${course.id}`}
                      className="inline-flex w-full justify-center items-center bg-gray-50 text-blue-600 font-extrabold px-4 py-3.5 rounded-xl hover:bg-blue-600 hover:text-white transition-colors border border-gray-200 hover:border-transparent shadow-sm tracking-wide"
                    >
                      Manage Video & Text
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
