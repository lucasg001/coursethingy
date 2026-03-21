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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="bg-gray-100 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">📚 Course Platform</h1>
          <div className="flex gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">Learn Anything, Anytime</h2>
        <p className="text-2xl mb-8 text-gray-700">
          Discover thousands of courses from expert instructors
        </p>
        
        {user ? (
          <Link href="/dashboard" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
            Dashboard
          </Link>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
              Get Started
            </Link>
          </div>
        )}
      </div>



      {/* Footer */}
      <div className="bg-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-700">
          <p>&copy; 2026 Course Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
