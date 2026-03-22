'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkUser = async () => {
    const result = await supabase.auth.getSession()
    const session = result.data?.session
    setUser(session?.user ?? null)
    setLoading(false)
  }

  useEffect(() => {
    checkUser()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium tracking-wide">Loading platform...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex justify-between items-center transition-all">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-900 hover:text-blue-700 transition-colors">
            Course Platform
          </Link>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <Link href="/courses" className="px-5 py-2.5 rounded-lg bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 hover:text-gray-900 transition-all border border-transparent shadow-sm">
                  Student Catalog
                </Link>
                <Link href="/dashboard" className="px-5 py-2.5 rounded-lg bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 hover:text-gray-900 transition-all hidden sm:block border border-transparent shadow-sm">
                  Creator Studio
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2.5 rounded-lg bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 hover:text-gray-900 transition-all">
                  Login
                </Link>
                <Link href="/signup" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 duration-300">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 text-center">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
          Learn Anything, <span className="text-blue-600">Anytime</span>
        </h2>
        <p className="text-xl md:text-2xl mb-12 text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
          Discover external modules or become a creator and release your own content to the world.
        </p>
        
        {user ? (
          <div className="flex gap-6 justify-center flex-col sm:flex-row">
            <Link href="/courses" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl font-extrabold text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1 duration-300 tracking-wide">
              Browse Catalog
            </Link>
            <Link href="/dashboard" className="bg-white text-gray-900 border border-gray-200 px-10 py-4 rounded-xl font-extrabold text-lg hover:bg-gray-50 transition-all hover:border-gray-300 shadow-sm tracking-wide">
              Creator Studio
            </Link>
          </div>
        ) : (
          <div className="flex gap-6 justify-center flex-col sm:flex-row">
            <Link href="/signup" className="bg-blue-600 text-white px-10 py-4 rounded-xl font-extrabold text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1 duration-300 tracking-wide">
              Join the Platform
            </Link>
            <Link href="/courses" className="bg-white text-gray-900 border border-gray-200 px-10 py-4 rounded-xl font-extrabold text-lg hover:bg-gray-50 transition-all hover:border-gray-300 shadow-sm tracking-wide">
              Explore Courses
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-100 mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 text-center text-gray-500 font-extrabold tracking-widest uppercase text-xs">
          <p>&copy; {new Date().getFullYear()} Single-Video Course Engine. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
