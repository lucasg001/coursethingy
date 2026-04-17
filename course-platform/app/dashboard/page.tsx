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
  const [fullName, setFullName] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '' })
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', session.user.id).single()
      if (profile?.role !== 'creator') { router.push('/courses'); return }

      setFullName(profile.full_name || '')
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
    if (!user?.id) return

    try {
      const { data, error } = await supabase.from('courses').insert({
        title: formData.title,
        description: formData.description,
        instructor_id: user.id,
        framework: '[]'
      }).select()

      if (error) throw error

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 font-medium bg-[#0a0a0f]">Initializing Studio...</div>

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans relative overflow-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-700/8 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-orange-700/6 rounded-full blur-[100px]"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-50 border-b border-white/8 backdrop-blur-xl bg-black/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors shadow-lg shadow-amber-900/40">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            </div>
            <span className="text-lg font-extrabold tracking-tight">Creator Studio</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-bold hidden sm:block">{fullName}</span>
            <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
              Creator
            </div>
            <button onClick={handleLogout} className="px-4 py-2 bg-white/8 border border-white/10 text-gray-300 font-bold rounded-lg hover:bg-white/12 hover:text-white transition-all text-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 gap-6 bg-white/3 border border-white/8 p-8 rounded-3xl">
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-1">Creator Dashboard</h2>
            <p className="text-gray-400 font-medium">Manage your published courses and grow your audience.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-8 py-3.5 rounded-xl font-extrabold transition-all text-sm whitespace-nowrap ${
              showForm
                ? 'bg-white/8 text-gray-300 border border-white/10 hover:bg-white/12'
                : 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-900/30'
            }`}
          >
            {showForm ? 'Cancel' : '+ New Course'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white/3 border border-white/10 p-8 rounded-3xl mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-6">New Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-5">
              <div>
                <label className="block text-xs font-extrabold tracking-widest uppercase text-gray-400 mb-2">Course Title</label>
                <input type="text" required placeholder="E.g., Master TypeScript in 30 Days"
                  value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-5 py-4 border border-white/10 rounded-xl bg-white/5 text-white font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg" />
              </div>
              <div>
                <label className="block text-xs font-extrabold tracking-widest uppercase text-gray-400 mb-2">Description</label>
                <textarea required placeholder="What will students learn?"
                  value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-4 border border-white/10 rounded-xl bg-white/5 text-white font-medium placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 h-36 resize-none text-lg leading-relaxed" />
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-amber-900/30 text-lg">
                Create Course →
              </button>
            </form>
          </div>
        )}

        {/* Courses Grid */}
        <div>
          <h3 className="text-xl font-extrabold text-white mb-6 flex items-center gap-3">
            Your Courses
            <span className="bg-white/8 border border-white/10 text-gray-400 rounded-full px-3 py-1 text-sm font-bold">{courses.length}</span>
          </h3>

          {courses.length === 0 ? (
            <div className="bg-white/3 border border-white/8 rounded-3xl p-20 text-center">
              <p className="text-2xl font-extrabold text-white mb-2">No Courses Yet</p>
              <p className="text-gray-500 font-medium">Click &quot;+ New Course&quot; above to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white/3 border border-white/8 rounded-3xl p-6 flex flex-col hover:border-white/15 hover:bg-white/5 transition-all duration-300">
                  <div className="h-32 bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-orange-600/10 group-hover:from-amber-600/20 group-hover:to-orange-600/20 transition-all"></div>
                    <svg className="w-8 h-8 text-amber-500/50" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    {course.video_url && (
                      <div className="absolute top-2 right-2 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest">
                        Video
                      </div>
                    )}
                  </div>
                  <h4 className="text-lg font-extrabold text-white mb-2 line-clamp-2">{course.title}</h4>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3 flex-1 mb-5">{course.description}</p>
                  <Link
                    href={`/course/${course.id}`}
                    className="w-full text-center bg-white/8 border border-white/10 text-gray-300 hover:bg-amber-500/15 hover:text-amber-400 hover:border-amber-500/20 font-bold py-3 rounded-xl transition-all text-sm"
                  >
                    Manage Course
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
