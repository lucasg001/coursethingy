'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Phase } from '@/components/CourseFramework'

export default function LessonEditor() {
  const params = useParams()
  const courseId = params.id as string
  const lessonNumberStr = params.lessonNumber as string
  const lessonNumber = parseInt(lessonNumberStr, 10)
  const router = useRouter()
  
  const [course, setCourse] = useState<any>(null)
  const [framework, setFramework] = useState<Phase[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonDescription, setLessonDescription] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      fetchCourse(session.user.id)
    }
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const fetchCourse = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('instructor_id', userId)
        .single()

      if (error || !data) {
        setLoading(false)
        return
      }

      setCourse(data)
      if (data.framework) {
        const parsed: Phase[] = JSON.parse(data.framework)
        setFramework(parsed)
        
        let found = false
        for (const phase of parsed) {
          const lesson = phase.lessons.find(l => l.number === lessonNumber)
          if (lesson) {
            setLessonTitle(lesson.title)
            setLessonDescription(lesson.description)
            found = true
            break
          }
        }
        if (!found) console.error("Lesson not found")
      }
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!course) return
    const updatedFramework = JSON.parse(JSON.stringify(framework)) as Phase[]
    for (const phase of updatedFramework) {
      const lessonIndex = phase.lessons.findIndex(l => l.number === lessonNumber)
      if (lessonIndex !== -1) {
        phase.lessons[lessonIndex].title = lessonTitle
        phase.lessons[lessonIndex].description = lessonDescription
        break
      }
    }

    const { error } = await supabase
      .from('courses')
      .update({ framework: JSON.stringify(updatedFramework) })
      .eq('id', courseId)
      
    if (error) {
      alert('Failed to save lesson configurations.')
    } else {
      setFramework(updatedFramework)
      router.push(`/course/${courseId}`)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Authenticating configuration...</div>
  if (!course) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Record missing or unauthorized.</div>

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex justify-between items-center transition-all">
          <Link href={`/course/${courseId}`} className="text-gray-600 hover:text-blue-600 font-bold transition-colors">
            Discard and Return
          </Link>
          <div className="bg-gray-100 text-gray-800 font-extrabold px-5 py-2 rounded-full text-sm tracking-wide border border-gray-200 shadow-sm">
            Updating Module {lessonNumber}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 space-y-8 relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div className="border-b border-gray-100 pb-6 mb-8 mt-2">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Lesson Parameters</h2>
            <p className="text-gray-500 font-medium mt-2">Adjust content definitions directly reflected in the curriculum map.</p>
          </div>
          
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-extrabold text-gray-700 tracking-wide uppercase mb-3 text-blue-900/80">Title Assignment</label>
              <input 
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 hover:bg-white transition-colors text-lg font-bold placeholder-gray-400 shadow-sm"
                placeholder="Declare module objective..."
              />
            </div>
            
            <div>
               <label className="block text-sm font-extrabold text-gray-700 tracking-wide uppercase mb-3 text-blue-900/80">Instructional Description</label>
              <textarea 
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                rows={8}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 hover:bg-white transition-colors text-lg font-medium resize-none placeholder-gray-400 leading-relaxed shadow-sm"
                placeholder="Provide comprehensive details about actionable items within this module structure."
              />
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100 mt-10">
            <button 
              onClick={handleSave}
              className="w-full bg-blue-600 text-white font-extrabold py-5 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 text-lg tracking-wide"
            >
              Commit Configuration Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
