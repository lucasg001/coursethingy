'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import VideoUpload from '@/components/VideoUpload'
import CourseFramework, { courseFramework, Phase } from '@/components/CourseFramework'

// Note: Check that CourseFramework returns JSX, not void

interface Course {
  id: string
  title: string
  description: string
  video_url?: string
  checkpoints?: string
  pdfs?: string
  framework?: string
}

export default function CourseEditor() {
  const params = useParams()
  const courseId = params.id as string
  const router = useRouter()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [frameworkData, setFrameworkData] = useState<Phase[]>(courseFramework as Phase[])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [checkpoints, setCheckpoints] = useState<string[]>([''])
  const [pdfs, setPdfs] = useState<{ name: string; url: string }[]>([])

  const checkAuth = async () => {
    try {
      const result = await supabase.auth.getSession()
      const session = result.data?.session
      
      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)
      fetchCourse(session.user.id)
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/login')
    }
  }

  const fetchCourse = async (userId: string) => {
    try {
      const { data: courseData, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('instructor_id', userId)
        .single()

      if (error) {
        console.error('Fetch course error:', error)
        setLoading(false)
        return
      }

      if (courseData) {
        setCourse(courseData)
        setVideoUrl(courseData.video_url || '')
        setCheckpoints(courseData.checkpoints ? JSON.parse(courseData.checkpoints) : [''])
        setPdfs(courseData.pdfs ? JSON.parse(courseData.pdfs) : [])
        if (courseData.framework) {
          try {
            setFrameworkData(JSON.parse(courseData.framework))
          } catch {
            // ignore parse errors
          }
        }
      }
      setLoading(false)
    } catch (error) {
      console.error('Course fetch exception:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddCheckpoint = () => {
    setCheckpoints([...checkpoints, ''])
  }

  const handleCheckpointChange = (index: number, value: string) => {
    const updated = [...checkpoints]
    updated[index] = value
    setCheckpoints(updated)
  }

  const handleRemoveCheckpoint = (index: number) => {
    const updated = checkpoints.filter((_, i) => i !== index)
    setCheckpoints(updated)
  }

  const handleSaveCheckpoints = async () => {
    const filteredCheckpoints = checkpoints.filter(cp => cp.trim())
    
    if (filteredCheckpoints.length === 0) {
      alert('Please add at least one checkpoint')
      return
    }

    const { error } = await supabase
      .from('courses')
      .update({ checkpoints: JSON.stringify(filteredCheckpoints) })
      .eq('id', courseId)

    if (!error) {
      alert('Checkpoints saved!')
    }
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes('pdf')) {
      alert('Please upload a PDF file')
      return
    }

    const fileName = `${courseId}/${Date.now()}_${file.name}`
    
    const { error: uploadError } = await supabase.storage
      .from('course-materials')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      alert('Failed to upload PDF')
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('course-materials')
      .getPublicUrl(fileName)

    const newPdfs = [...pdfs, { name: file.name, url: publicUrl }]
    setPdfs(newPdfs)

    const { error: updateError } = await supabase
      .from('courses')
      .update({ pdfs: JSON.stringify(newPdfs) })
      .eq('id', courseId)

    if (!updateError) {
      alert('PDF uploaded!')
      e.target.value = ''
    }
  }

  const handleRemovePdf = async (index: number) => {
    const updated = pdfs.filter((_, i) => i !== index)
    setPdfs(updated)

    const { error } = await supabase
      .from('courses')
      .update({ pdfs: JSON.stringify(updated) })
      .eq('id', courseId)

    if (!error) {
      alert('PDF removed!')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!course) return <div className="min-h-screen flex items-center justify-center">Course not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">{course.title}</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Course Framework Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">📚 Course Structure</h2>
            <CourseFramework
              courseId={courseId}
              initialFramework={frameworkData}
              onFrameworkSave={async updated => {
                await supabase
                  .from('courses')
                  .update({ framework: JSON.stringify(updated) })
                  .eq('id', courseId)
                setFrameworkData(updated)
              }}
            />
          </div>

          {/* Video Section */}
          <VideoUpload
            courseId={courseId}
            currentVideoUrl={videoUrl}
            onVideoUploaded={(newUrl) => {
              setVideoUrl(newUrl)
              if (user && user.id) {
                fetchCourse(user.id)
              }
            }}
          />

          {/* Lesson Checkpoints Section */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">✓ Lesson Checkpoints</h2>
            <div className="space-y-4">
              {checkpoints.map((checkpoint, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={checkpoint}
                    onChange={(e) => handleCheckpointChange(index, e.target.value)}
                    placeholder="Enter checkpoint (e.g., 'Introduction completed')"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {checkpoints.length > 1 && (
                    <button
                      onClick={() => handleRemoveCheckpoint(index)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <button
                  onClick={handleAddCheckpoint}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Add Checkpoint
                </button>
                <button
                  onClick={handleSaveCheckpoints}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Checkpoints
                </button>
              </div>
            </div>
          </div>

          {/* PDF Upload Section */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">📄 Course Materials (PDF)</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <label className="cursor-pointer">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-gray-600 mb-2">Click to upload PDF</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {pdfs.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-700">Uploaded Materials:</h3>
                  {pdfs.map((pdf, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                        {pdf.name}
                      </a>
                      <button
                        onClick={() => handleRemovePdf(index)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
