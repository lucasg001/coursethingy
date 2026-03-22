'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface VideoUploadProps {
  courseId: string
  onVideoUploaded?: (videoUrl: string) => void
  currentVideoUrl?: string
}

export default function VideoUpload({ courseId, onVideoUploaded, currentVideoUrl }: VideoUploadProps) {
  const [videoUrl, setVideoUrl] = useState(currentVideoUrl || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSaveUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!videoUrl.trim()) {
      setError('Please enter a video URL')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase
        .from('courses')
        .update({ video_url: videoUrl })
        .eq('id', courseId)

      if (updateError) {
        setError(`Error: ${updateError.message}`)
        return
      }

      alert('Video saved successfully!')
      onVideoUploaded?.(videoUrl)
    } catch (err: unknown) {
      console.error('Error saving video:', err)
      setError(`Failed to save: ${(err as Error)?.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full transition-all">
      <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">Course Trailer / Primary Video URL</h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl font-medium text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSaveUrl} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Video Link
          </label>
          <p className="text-sm text-gray-500 font-medium mb-3">
            Paste an unlisted YouTube, Vimeo, or Wistia URL to feature on the course.
          </p>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 hover:bg-white transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5 duration-300 inline-block"
        >
          {loading ? 'Saving Link...' : 'Save Video URL'}
        </button>
      </form>

      {currentVideoUrl && (
        <div className="mt-8 pt-8 border-t border-gray-100">
          <h4 className="font-bold text-gray-900 mb-4 tracking-tight">Active Configuration</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm">
                Saved Link
              </span>
              <p className="text-sm text-gray-500 font-mono break-all line-clamp-1 flex-grow">{currentVideoUrl}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
