'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  const checkUser = async () => {
    const result = await supabase.auth.getSession()
    const session = result.data?.session
    if (session?.user) {
      setUser(session.user)
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      setUserRole(profile?.role || null)
    }
    setLoading(false)
  }

  useEffect(() => {
    checkUser()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserRole(null)
    router.refresh()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium tracking-wide bg-[#0a0a0f]">Loading...</div>
  }

  const features = [
    { icon: '🎓', title: 'Learn from Creators', desc: 'Access curated courses from expert instructors in your niche.', accent: 'blue' },
    { icon: '🏆', title: 'Earn XP & Level Up', desc: 'A gamified learning system keeps you motivated to keep going.', accent: 'emerald' },
    { icon: '🚀', title: 'Publish Your Course', desc: 'Become a creator! Upload your video courses and grow an audience.', accent: 'cyan' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans relative overflow-hidden">
      {/* Background glows - simplified, no purple gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-cyan-700/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/8 backdrop-blur-xl bg-black/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13"/></svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight">Course Platform</span>
          </Link>

          <div className="flex gap-3 items-center">
            {user ? (
              <>
                {userRole === 'student' && (
                  <Link href="/courses" className="px-4 py-2 rounded-lg text-gray-300 font-bold hover:text-white hover:bg-white/5 transition-colors">
                    My Courses
                  </Link>
                )}
                {userRole === 'creator' && (
                  <Link href="/dashboard" className="px-4 py-2 rounded-lg text-gray-300 font-bold hover:text-white hover:bg-white/5 transition-colors">
                    Creator Studio
                  </Link>
                )}
                <button onClick={handleLogout} className="px-4 py-2 bg-white/10 border border-white/10 text-white font-bold rounded-lg hover:bg-white/15 transition-all">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 rounded-lg text-gray-300 font-bold hover:text-white hover:bg-white/5 transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-28 md:py-40 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-bold px-4 py-2 rounded-full mb-8 tracking-wide">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          Gamified Learning Platform
        </div>

        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight leading-tight mb-6">
          Learn.{' '}
          <span className="text-blue-400">
            Level Up.
          </span>
          <br />
          Create.
        </h1>

        <p className="text-xl md:text-2xl mb-12 text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed">
          Discover world-class courses, earn XP, and build your learning streak. Or become a creator and share your knowledge with the world.
        </p>

        {user ? (
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link href={userRole === 'creator' ? '/dashboard' : '/courses'} className={`inline-block text-white px-10 py-4 rounded-xl font-extrabold text-lg transition-all shadow-xl transform hover:-translate-y-1 duration-200 tracking-wide ${userRole === 'creator' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40 hover:shadow-emerald-500/30' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40 hover:shadow-blue-500/30'}`}>
              {userRole === 'creator' ? 'Creator Studio →' : 'Browse Courses →'}
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link href="/signup" className="bg-blue-600 text-white px-10 py-4 rounded-xl font-extrabold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 hover:shadow-blue-500/30 transform hover:-translate-y-1 duration-200 tracking-wide">
              Join the Platform
            </Link>
            <Link href="/courses" className="bg-white/5 border border-white/10 text-white px-10 py-4 rounded-xl font-extrabold text-lg hover:bg-white/10 transition-all tracking-wide">
              Explore Courses
            </Link>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div key={feat.title} className="bg-white/3 border border-white/8 rounded-3xl p-8 hover:border-white/15 hover:bg-white/5 transition-all duration-300 group">
              <div className="text-4xl mb-4">{feat.icon}</div>
              <h3 className="text-xl font-extrabold text-white mb-2">{feat.title}</h3>
              <p className="text-gray-400 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 text-center text-gray-600 font-bold tracking-widest uppercase text-xs">
          &copy; {new Date().getFullYear()} Course Platform. All rights reserved.
        </div>
      </div>
    </div>
  )
}
