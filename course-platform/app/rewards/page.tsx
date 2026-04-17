'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import StudentSidebar from '@/components/StudentSidebar'

const LEVEL_THRESHOLD = 100

const RANK_NAMES = [
  'Newcomer', 'Apprentice', 'Scholar', 'Adept', 'Expert',
  'Master', 'Grandmaster', 'Legend', 'Mythic', 'Ascendant'
]

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

const RANK_BG_COLORS = [
  'bg-gray-500/10 border-gray-500/20',
  'bg-green-500/10 border-green-500/20',
  'bg-blue-500/10 border-blue-500/20',
  'bg-blue-500/10 border-blue-500/20',
  'bg-pink-500/10 border-pink-500/20',
  'bg-orange-500/10 border-orange-500/20',
  'bg-yellow-500/10 border-yellow-500/20',
  'bg-red-500/10 border-red-500/20',
  'bg-fuchsia-500/10 border-fuchsia-500/20',
  'bg-indigo-500/10 border-indigo-500/20',
]

const REWARDS = [
  { xp: 10, icon: '⭐', title: 'First Follow', desc: 'Follow your first creator.' },
  { xp: 50, icon: '📖', title: 'Enrolled!', desc: 'Enroll in your first course.' },
  { xp: 100, icon: '🥉', title: 'Level 2', desc: 'Reach Level 2.' },
  { xp: 200, icon: '📚', title: 'Scholar', desc: 'Reach Level 3.' },
  { xp: 300, icon: '🎯', title: 'Adept', desc: 'Reach Level 4.' },
  { xp: 400, icon: '🔥', title: 'Expert', desc: 'Reach Level 5.' },
  { xp: 500, icon: '🥇', title: 'Master', desc: 'Reach Level 6.' },
  { xp: 750, icon: '🏅', title: 'Grandmaster', desc: 'Reach Level 8.' },
  { xp: 999, icon: '💎', title: 'Diamond', desc: 'Earn 999 XP.' },
]

export default function RewardsPage() {
  const [points, setPoints] = useState(0)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, points, role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role === 'creator') { router.push('/dashboard'); return }
      setFullName(profile?.full_name || '')
      setPoints(profile?.points || 0)
      setLoading(false)
    }
    init()
  }, [router])

  const level = Math.floor(points / LEVEL_THRESHOLD) + 1
  const pointsInLevel = points % LEVEL_THRESHOLD
  const progress = (pointsInLevel / LEVEL_THRESHOLD) * 100

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-gray-400 font-bold">Loading rewards...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex font-sans">
      <StudentSidebar />
      <div className="flex-1 overflow-y-auto h-screen">
        {/* Fixed background glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 w-[400px] h-[400px] bg-blue-700/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-amber-700/8 rounded-full blur-[80px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              🏆 XP & Rewards
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">Your Progress</h1>
            <p className="text-gray-400 font-medium text-lg">Earn XP by learning, following creators, and completing milestones.</p>
          </div>

          {/* Main XP Card */}
          <div className="bg-white/5 border border-white/8 rounded-3xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${RANK_COLORS[Math.min(level - 1, RANK_COLORS.length - 1)]} flex items-center justify-center text-white font-black text-4xl shadow-2xl flex-shrink-0`}>
                  {level}
                </div>
                <div className="flex-1">
                  <div className="flex items-end gap-3 mb-1">
                    <h2 className="text-3xl font-extrabold text-white">Level {level}</h2>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${RANK_BG_COLORS[Math.min(level - 1, RANK_BG_COLORS.length - 1)]} text-gray-300 border mb-1`}>
                      {RANK_NAMES[Math.min(level - 1, RANK_NAMES.length - 1)]}
                    </span>
                  </div>
                  <p className="text-gray-400 font-medium mb-4">Total XP: <span className="text-white font-extrabold">{points}</span></p>
                  <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${RANK_COLORS[Math.min(level - 1, RANK_COLORS.length - 1)]} h-4 rounded-full transition-all duration-1000 ease-out relative`}
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm font-bold mt-2">{pointsInLevel} / {LEVEL_THRESHOLD} XP — {LEVEL_THRESHOLD - pointsInLevel} XP to Level {level + 1}</p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Earn XP */}
          <div className="mb-10">
            <h2 className="text-xl font-extrabold text-white mb-5">How to Earn XP</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { action: 'Follow a Creator', xp: '+10 XP', icon: '🤝', color: 'blue' },
                { action: 'Enroll in a Course', xp: '+50 XP', icon: '📖', color: 'amber' },
                { action: 'Complete a Lesson', xp: 'Coming soon', icon: '✅', color: 'blue' },
                { action: 'Daily Login Streak', xp: 'Coming soon', icon: '🔥', color: 'orange' },
                { action: 'Rate a Course', xp: 'Coming soon', icon: '⭐', color: 'yellow' },
                { action: 'Share a Course', xp: 'Coming soon', icon: '🔗', color: 'green' },
              ].map((item) => (
                <div key={item.action} className="bg-white/3 border border-white/8 rounded-2xl p-5 flex items-center gap-4 hover:border-white/15 hover:bg-white/5 transition-all">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{item.action}</p>
                    <p className={`text-xs font-extrabold ${item.xp.includes('soon') ? 'text-gray-600' : 'text-green-400'}`}>{item.xp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Level Grid */}
          <div className="mb-10">
            <h2 className="text-xl font-extrabold text-white mb-5">Ranks & Levels</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {RANK_NAMES.map((rank, i) => {
                const rankLevel = i + 1
                const isUnlocked = level >= rankLevel
                const isCurrent = level === rankLevel
                return (
                  <div
                    key={rank}
                    className={`rounded-2xl p-4 border text-center transition-all ${
                      isCurrent
                        ? `${RANK_BG_COLORS[i]} scale-105 shadow-lg`
                        : isUnlocked
                        ? 'bg-white/5 border-white/10'
                        : 'bg-white/2 border-white/5 opacity-40'
                    }`}
                  >
                    <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${RANK_COLORS[i]} flex items-center justify-center text-white font-black text-lg mb-2 ${isUnlocked ? 'shadow-md' : 'grayscale opacity-50'}`}>
                      {rankLevel}
                    </div>
                    <p className={`text-xs font-extrabold ${isCurrent ? 'text-white' : isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>{rank}</p>
                    <p className={`text-[10px] font-bold mt-1 ${isCurrent ? 'text-blue-400' : 'text-gray-600'}`}>
                      {isCurrent ? 'Current' : isUnlocked ? 'Unlocked' : `${(rankLevel - 1) * LEVEL_THRESHOLD} XP`}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Milestones / Badges */}
          <div>
            <h2 className="text-xl font-extrabold text-white mb-5">Milestones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REWARDS.map((reward) => {
                const isUnlocked = points >= reward.xp
                return (
                  <div
                    key={reward.title}
                    className={`rounded-2xl p-5 border flex items-center gap-4 transition-all ${
                      isUnlocked
                        ? 'bg-blue-600/10 border-blue-500/20 hover:border-blue-500/40'
                        : 'bg-white/3 border-white/8 opacity-50 grayscale'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${isUnlocked ? 'bg-blue-500/15' : 'bg-white/5'}`}>
                      {isUnlocked ? reward.icon : '🔒'}
                    </div>
                    <div>
                      <p className={`font-extrabold text-sm ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{reward.title}</p>
                      <p className={`text-xs font-medium ${isUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>{reward.desc}</p>
                      <p className={`text-xs font-extrabold mt-0.5 ${isUnlocked ? 'text-blue-400' : 'text-gray-600'}`}>{reward.xp} XP required</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
