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
        console.error('Fetch course error:', error)
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
        if (!found) {
          console.error("Lesson not found")
        }
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!course) return
    const updatedFramework = JSON.parse(JSON.stringify(framework)) as Phase[] // deep copy
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
      alert('Failed to save lesson details.')
    } else {
      setFramework(updatedFramework)
      alert('Lesson saved successfully!')
      router.push(`/course/${courseId}`)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!course) return <div className="min-h-screen flex items-center justify-center">Course or Lesson not found</div>

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href={`/course/${courseId}`} className="text-blue-600 hover:underline font-semibold">
            ← Back to Course Editor
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Lesson {lessonNumber}</h1>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow space-y-6">
          <h2 className="text-3xl font-bold text-blue-900 border-b pb-4">✏️ Lesson Details</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Lesson Title</label>
            <input 
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition"
              placeholder="E.g. The Promise"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Lesson Description</label>
            <textarea 
              value={lessonDescription}
              onChange={(e) => setLessonDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition"
              placeholder="Describe the objective and format of this lesson..."
            />
          </div>
          <button 
            onClick={handleSave}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 hover:shadow-lg transition text-lg mt-8 inline-block"
          >
            Save Lesson
          </button>
        </div>
      </div>
    </div>
  )
}
