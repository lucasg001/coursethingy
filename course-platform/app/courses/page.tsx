'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import StudentSidebar from '@/components/StudentSidebar'

interface Course {
  id: string
  title: string
  description: string
  instructor_id: string
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set())
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
        
      if (profile?.role === 'creator') {
        router.push('/dashboard')
        return
      }

      setUser(session.user)

      const { data: followsData } = await supabase.from('creator_followers').select('creator_id').eq('student_id', session.user.id)
      if (followsData) {
        const followSet = new Set<string>()
        followsData.forEach(f => followSet.add(f.creator_id))
        setFollowingIds(followSet)
      }

      const { data: enrollsData } = await supabase.from('course_enrollments').select('course_id').eq('student_id', session.user.id)
      if (enrollsData) {
        const enrollSet = new Set<string>()
        enrollsData.forEach(e => enrollSet.add(e.course_id))
        setEnrolledIds(enrollSet)
      }

      const { data, error } = await supabase.from('courses').select('*')
      if (!error && data) setCourses(data)
      setLoading(false)
    }
    
    init()
  }, [router])

  const handleEnroll = async (e: React.MouseEvent, courseId: string) => {
    e.preventDefault()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('course_enrollments').insert({ student_id: user.id, course_id: courseId })

    if (!error) {
      setEnrolledIds(prev => { const next = new Set(prev); next.add(courseId); return next })
      const { data: profile } = await supabase.from('profiles').select('points').eq('id', user.id).single()
      if (profile) {
        await supabase.from('profiles').update({ points: (profile.points || 0) + 50 }).eq('id', user.id)
        window.dispatchEvent(new Event('gamification_update'))
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex font-sans">
      <StudentSidebar />
      <div className="flex-1 overflow-y-auto h-screen relative">
        {/* Background glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-700/8 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-700/6 rounded-full blur-[80px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              📚 Course Catalog
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">Student Catalog</h1>
            <p className="text-gray-400 font-medium text-lg">Follow creators you love, enroll in their courses, and start learning.</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500 font-bold text-xl">Scanning courses...</div>
          ) : courses.length === 0 ? (
            <div className="bg-white/3 border border-white/8 rounded-3xl p-24 text-center">
              <h3 className="text-3xl font-extrabold text-white mb-4">No courses yet</h3>
              <p className="text-gray-500 font-medium text-xl">Check back soon as creators publish new content.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => {
                const followsCreator = followingIds.has(course.instructor_id)
                const isEnrolled = enrolledIds.has(course.id)

                return (
                  <div key={course.id} className="bg-white/3 border border-white/8 rounded-3xl overflow-hidden hover:border-white/15 hover:bg-white/5 transition-all duration-300 group flex flex-col">
                    {/* Thumbnail */}
                    <div className="h-44 bg-blue-900/50 relative flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/30 transition-all duration-500"></div>
                      <svg className="w-12 h-12 text-white/20 group-hover:text-white/30 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      {isEnrolled && (
                        <div className="absolute top-3 right-3 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                          ✓ Enrolled
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-extrabold text-xl text-white tracking-tight line-clamp-2 leading-snug mb-2">{course.title}</h3>
                      <p className="text-gray-500 text-sm font-medium line-clamp-3 flex-1 leading-relaxed mb-6">{course.description}</p>

                      <div className="pt-4 border-t border-white/8">
                        {isEnrolled ? (
                          <button onClick={(e) => { e.preventDefault(); router.push(`/play/${course.id}`) }}
                            className="w-full bg-green-500/15 border border-green-500/20 text-green-400 hover:bg-green-500/20 font-extrabold py-3 rounded-xl transition-all text-sm">
                            Continue Learning →
                          </button>
                        ) : followsCreator ? (
                          <button onClick={(e) => handleEnroll(e, course.id)}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/30 text-sm">
                            Enroll — +50 XP
                          </button>
                        ) : (
                          <button onClick={() => router.push('/creators')}
                            className="w-full bg-white/5 border border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20 font-bold py-3 rounded-xl transition-all text-sm">
                            🔒 Follow Creator to Enroll
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
