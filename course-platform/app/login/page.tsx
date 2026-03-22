'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student' | 'creator'>('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      if (role === 'creator') {
        router.push('/dashboard')
      } else {
        router.push('/courses')
      }
    } catch (error: unknown) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-16 px-6 sm:px-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100 transform transition-all">
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-900 hover:text-blue-700 transition-colors inline-block mb-4">
            Course Platform
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-2">Welcome back</h2>
          <p className="text-gray-500 font-medium mt-3">Select your portal and enter your details.</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl font-bold border border-red-100 text-sm shadow-sm">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4 mb-2">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-4 rounded-xl border-2 text-center transition-all duration-300 flex flex-col items-center gap-2 ${role === 'student' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm transform scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'}`}
            >
               <svg className={`w-8 h-8 ${role === 'student' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
               </svg>
               <span className="font-extrabold tracking-wide">Student</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('creator')}
              className={`p-4 rounded-xl border-2 text-center transition-all duration-300 flex flex-col items-center gap-2 ${role === 'creator' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm transform scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'}`}
            >
               <svg className={`w-8 h-8 ${role === 'creator' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
               </svg>
               <span className="font-extrabold tracking-wide">Creator</span>
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-extrabold tracking-widest uppercase text-gray-500 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 hover:bg-white transition-colors font-bold shadow-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-extrabold tracking-widest uppercase text-gray-500 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 hover:bg-white transition-colors font-bold shadow-sm"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-extrabold py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5 duration-300 mt-6 tracking-wide text-lg"
          >
            {loading ? 'Authenticating...' : `Log In as ${role === 'student' ? 'Student' : 'Creator'}`}
          </button>
        </form>
        
        <p className="text-center mt-10 text-gray-500 font-medium text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-extrabold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
