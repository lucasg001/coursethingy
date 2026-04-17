'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import StudentSidebar from '@/components/StudentSidebar'

interface CreatorProfile {
  id: string
  full_name: string
}

export default function CreatorsDirectory() {
  const [creators, setCreators] = useState<CreatorProfile[]>([])
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set())
  const [allCourses, setAllCourses] = useState<{instructor_id: string}[]>([])
  const [allFollowers, setAllFollowers] = useState<{creator_id: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) { router.push('/login'); return }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      if (profile?.role === 'creator') { router.push('/dashboard'); return }

      setUser(session.user)

      const { data: creatorsData } = await supabase.from('profiles').select('id, full_name').eq('role', 'creator')
      if (creatorsData) setCreators(creatorsData)

      const { data: followsData } = await supabase.from('creator_followers').select('creator_id').eq('student_id', session.user.id)
      if (followsData) {
        const followSet = new Set<string>()
        followsData.forEach(f => followSet.add(f.creator_id))
        setFollowingIds(followSet)
      }

      const { data: coursesData } = await supabase.from('courses').select('instructor_id')
      if (coursesData) setAllCourses(coursesData)

      const { data: allFollowsData } = await supabase.from('creator_followers').select('creator_id')
      if (allFollowsData) setAllFollowers(allFollowsData)

      setLoading(false)
    }
    
    init()
  }, [router])

  const toggleFollow = async (creatorId: string, isFollowing: boolean) => {
    if (!user) return

    if (isFollowing) {
      const { error } = await supabase.from('creator_followers').delete().eq('student_id', user.id).eq('creator_id', creatorId)
      if (!error) {
        setFollowingIds(prev => { const next = new Set(prev); next.delete(creatorId); return next })
        setAllFollowers(prev => { const idx = prev.findLastIndex(f => f.creator_id === creatorId); return idx >= 0 ? prev.filter((_, i) => i !== idx) : prev })
      }
    } else {
      const { error } = await supabase.from('creator_followers').insert({ student_id: user.id, creator_id: creatorId })
      if (!error) {
        setFollowingIds(prev => { const next = new Set(prev); next.add(creatorId); return next })
        setAllFollowers(prev => [...prev, { creator_id: creatorId }])
        const { data: profile } = await supabase.from('profiles').select('points').eq('id', user.id).single()
        if (profile) {
          await supabase.from('profiles').update({ points: (profile.points || 0) + 10 }).eq('id', user.id)
          window.dispatchEvent(new Event('gamification_update'))
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex font-sans">
      <StudentSidebar />
      <div className="flex-1 overflow-y-auto h-screen relative">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-amber-700/6 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-blue-700/8 rounded-full blur-[80px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              🎨 Creators
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">Creators Directory</h1>
            <p className="text-gray-400 font-medium text-lg">Follow instructors and unlock their courses. Get <span className="text-blue-400 font-extrabold">+10 XP</span> per follow!</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500 font-bold text-xl">Loading creators...</div>
          ) : creators.length === 0 ? (
            <div className="bg-white/3 border border-white/8 rounded-3xl p-24 text-center">
              <h3 className="text-3xl font-extrabold text-white mb-4">No creators yet</h3>
              <p className="text-gray-500 font-medium">Invite instructors to join the platform!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {creators.map((creator) => {
                const isFollowing = followingIds.has(creator.id)
                const courseCount = allCourses.filter(c => c.instructor_id === creator.id).length
                const followerCount = allFollowers.filter(f => f.creator_id === creator.id).length

                return (
                  <div key={creator.id} className="bg-white/3 border border-white/8 rounded-3xl p-6 flex flex-col hover:border-white/15 hover:bg-white/5 transition-all duration-300">
                    {/* Creator Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl flex-shrink-0 shadow-lg shadow-amber-900/30">
                        {creator.full_name?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-white">{creator.full_name || 'Creator'}</h3>
                        <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest mt-0.5">
                          Creator
                        </div>
                      </div>
                      {isFollowing && (
                        <div className="ml-auto w-2 h-2 bg-green-400 rounded-full shadow-sm shadow-green-400/50"></div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                        <p className="text-2xl font-extrabold text-white">{courseCount}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Courses</p>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/15 rounded-xl p-3 text-center">
                        <p className="text-2xl font-extrabold text-blue-300">{followerCount}</p>
                        <p className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">Followers</p>
                      </div>
                    </div>

                    <div className="mt-auto border-t border-white/8 pt-5">
                      <button
                        onClick={() => toggleFollow(creator.id, isFollowing)}
                        className={`w-full py-3.5 rounded-xl font-extrabold transition-all text-sm ${
                          isFollowing
                            ? 'bg-white/8 text-gray-400 border border-white/10 hover:bg-white/12 hover:text-gray-300'
                            : 'bg-blue-600 text-white hover:bg-blue-500 border border-transparent shadow-lg shadow-blue-900/30'
                        }`}
                      >
                        {isFollowing ? '✓ Following' : 'Follow Creator — +10 XP'}
                      </button>
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
