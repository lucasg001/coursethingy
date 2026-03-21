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
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6">📹 Add Video URL</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSaveUrl} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Paste YouTube (must be UNLISTED), Vimeo, or Wistia URL
          </p>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition"
        >
          {loading ? 'Saving...' : 'Save Video URL'}
        </button>
      </form>

      {currentVideoUrl && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold text-gray-900 mb-3">Current Video</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">✓ Video URL saved</p>
            <p className="text-xs text-gray-500 mt-2 break-all font-mono">{currentVideoUrl}</p>
          </div>
        </div>
      )}
    </div>
  )
}
