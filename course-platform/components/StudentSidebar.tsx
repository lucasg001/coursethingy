'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

const LEVEL_THRESHOLD = 100

const RANK_NAMES = [
  'Newcomer', 'Apprentice', 'Scholar', 'Adept', 'Expert',
  'Master', 'Grandmaster', 'Legend', 'Mythic', 'Ascendant'
]

function getRankName(level: number): string {
  return RANK_NAMES[Math.min(level - 1, RANK_NAMES.length - 1)] || 'Ascendant'
}

const RANK_COLORS = [
  'from-gray-400 to-gray-500',
  'from-green-400 to-emerald-500',
  'from-blue-400 to-cyan-500',
  'from-blue-400 to-cyan-500',
  'from-pink-400 to-rose-500',
  'from-orange-400 to-amber-500',
  'from-yellow-400 to-orange-500',
  'from-red-400 to-rose-600',
  'from-fuchsia-400 to-pink-600',
  'from-blue-400 to-blue-600',
]

function getRankColor(level: number): string {
  return RANK_COLORS[Math.min(level - 1, RANK_COLORS.length - 1)]
}

export default function StudentSidebar() {
  const [points, setPoints] = useState(0)
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('student')
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, points, role')
        .eq('id', session.user.id)
        .single()
      if (profile) {
        setRole(profile.role || 'student')
        setFullName(profile.full_name)
        setPoints(profile.points || 0)
      }
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile()
    const handleUpdate = () => fetchProfile()
    window.addEventListener('gamification_update', handleUpdate)
    return () => window.removeEventListener('gamification_update', handleUpdate)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (role === 'creator') return null

  const level = Math.floor(points / LEVEL_THRESHOLD) + 1
  const pointsInLevel = points % LEVEL_THRESHOLD
  const progress = (pointsInLevel / LEVEL_THRESHOLD) * 100
  const rankName = getRankName(level)
  const rankColor = getRankColor(level)

  const navLinks = [
    {
      name: 'Course Catalog',
      path: '/courses',
      emoji: '📚',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    },
    {
      name: 'Creators',
      path: '/creators',
      emoji: '🎨',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    },
    {
      name: 'Rewards & XP',
      path: '/rewards',
      emoji: '🏆',
      icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
    }
  ]

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#1a1a2e] border border-white/10 p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
        </svg>
      </button>

      {/* Overlay on mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div className={`w-72 bg-[#0d0d18] border-r border-white/8 flex flex-col h-screen sticky top-0 shadow-2xl z-40 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0 fixed' : '-translate-x-full fixed md:relative'}`}>
        
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5"/></svg>
            </div>
            <div>
              <span className="text-white font-extrabold tracking-tight block text-sm">Course Platform</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Student Portal</span>
            </div>
          </Link>
        </div>

        {/* Profile & Level */}
        <div className="px-6 pt-6 pb-5 border-b border-white/8">
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rankColor} flex items-center justify-center text-white font-extrabold text-xl shadow-lg flex-shrink-0`}>
              {fullName?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="min-w-0">
              <p className="text-white font-extrabold text-sm truncate">{fullName || 'Student'}</p>
              <p className="text-gray-500 text-xs font-bold">{rankName}</p>
            </div>
          </div>

          {/* XP Card */}
          <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${rankColor} flex items-center justify-center text-xs font-black text-white`}>
                  {level}
                </div>
                <span className="text-white font-extrabold text-sm">Level {level}</span>
              </div>
              <span className="text-gray-400 text-xs font-bold">{pointsInLevel} / {LEVEL_THRESHOLD} XP</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${rankColor} h-2 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-600 text-[10px] font-bold mt-2 uppercase tracking-widest">{LEVEL_THRESHOLD - pointsInLevel} XP to next level</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-600 mb-3 px-2">Navigate</p>
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path
              return (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl font-bold transition-all text-sm ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{link.emoji}</span>
                    {link.name}
                    {isActive && <div className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full"></div>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-white/8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-gray-500 font-bold rounded-xl hover:bg-white/5 hover:text-gray-300 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </>
  )
}
