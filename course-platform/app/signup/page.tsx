'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'student' | 'creator'>('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: fullName,
          email: email,
          role: role
        })
        if (profileError) throw profileError

        if (role === 'creator') {
          router.push('/dashboard')
        } else {
          router.push('/courses')
        }
      }
    } catch (error: unknown) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    {
      value: 'student',
      label: 'Student',
      desc: 'Learn from creators',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    },
    {
      value: 'creator',
      label: 'Creator',
      desc: 'Publish your courses',
      icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] py-16 px-6 sm:px-8 font-sans relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-[#12121a] border border-white/10 p-10 rounded-3xl shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">Course Platform</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Create your account</h2>
            <p className="text-gray-400 font-medium mt-2">Choose how you want to use the platform.</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {roleOptions.map((option) => {
              const isSelected = role === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value as 'student' | 'creator')}
                  className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 flex flex-col items-center gap-2 ${
                    isSelected
                      ? option.value === 'creator'
                        ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                        : 'border-blue-500/60 bg-blue-500/10 text-blue-300'
                      : 'border-white/10 bg-white/5 text-gray-500 hover:border-white/20 hover:bg-white/8'
                  }`}
                >
                  <svg className={`w-7 h-7 ${isSelected ? (option.value === 'creator' ? 'text-emerald-400' : 'text-blue-400') : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                  </svg>
                  <span className="font-extrabold">{option.label}</span>
                  <span className={`text-xs ${isSelected ? 'opacity-70' : 'text-gray-600'}`}>{option.desc}</span>
                </button>
              )
            })}
          </div>

          <form className="space-y-4" onSubmit={handleSignUp}>
            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-xl font-bold border border-red-500/20 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold tracking-widest uppercase text-gray-400 mb-2">Full Name</label>
              <input type="text" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-5 py-4 border border-white/10 rounded-xl focus:outline-none focus:ring-2 text-white bg-white/5 hover:bg-white/8 transition-colors font-bold placeholder-gray-600 ${role === 'creator' ? 'focus:ring-emerald-500' : 'focus:ring-blue-500'}`} required />
            </div>

            <div>
              <label className="block text-xs font-extrabold tracking-widest uppercase text-gray-400 mb-2">Email Address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-5 py-4 border border-white/10 rounded-xl focus:outline-none focus:ring-2 text-white bg-white/5 hover:bg-white/8 transition-colors font-bold placeholder-gray-600 ${role === 'creator' ? 'focus:ring-emerald-500' : 'focus:ring-blue-500'}`} required />
            </div>

            <div>
              <label className="block text-xs font-extrabold tracking-widest uppercase text-gray-400 mb-2">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-5 py-4 border border-white/10 rounded-xl focus:outline-none focus:ring-2 text-white bg-white/5 hover:bg-white/8 transition-colors font-bold placeholder-gray-600 ${role === 'creator' ? 'focus:ring-emerald-500' : 'focus:ring-blue-500'}`} required />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-extrabold py-4 rounded-xl disabled:opacity-50 transition-all shadow-lg transform hover:-translate-y-0.5 duration-200 mt-2 tracking-wide text-lg text-white ${
                role === 'creator'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'
              }`}
            >
              {loading ? 'Creating account...' : `Join as ${role === 'student' ? 'Student' : 'Creator'}`}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 font-medium text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-extrabold transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
