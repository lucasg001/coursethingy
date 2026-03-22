'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Debug() {
  const [status, setStatus] = useState<{
    supabase: string
    auth: string
    tables: string
    error?: string
  }>({
    supabase: 'checking...',
    auth: 'checking...',
    tables: 'checking...',
  })

  const checkConnection = async () => {
    const result = { supabase: '', auth: '', tables: '', error: '' }

    try {
      // Check Supabase connection
      const { data, error } = await supabase.from('courses').select('count', { count: 'exact' })

      if (error) {
        result.supabase = `❌ Failed: ${error.message}`
        result.error = error.message
      } else if (data) {
        result.supabase = '[OK] Supabase connected'
      } else {
        result.supabase = '⚠️ Supabase returned no data'
      }

      // Check auth
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        result.auth = `[OK] Authenticated as ${session.user.email}`
      } else {
        result.auth = '⚠️ Not authenticated (this is normal for non-logged in users)'
      }

      // Check tables
      result.tables = '[OK] Courses table accessible'
    } catch (error: unknown) {
      result.error = (error as Error).message
      result.supabase = `❌ Error: ${(error as Error).message}`
    }

    setStatus(result)
  }

  useEffect(() => {
    checkConnection()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Connection Diagnostic</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="font-semibold">Supabase</h3>
            <p className="text-gray-600">{status.supabase}</p>
          </div>

          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h3 className="font-semibold">Authentication</h3>
            <p className="text-gray-600">{status.auth}</p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <h3 className="font-semibold">Database Tables</h3>
            <p className="text-gray-600">{status.tables}</p>
          </div>

          {status.error && (
            <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
              <h3 className="font-semibold text-red-700">Error Details</h3>
              <p className="text-red-600 text-sm font-mono">{status.error}</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p><span className="font-bold">Note:</span> If Supabase shows an error, check:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>.env.local file has NEXT_PUBLIC_SUPABASE_URL</li>
            <li>.env.local file has NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>Supabase project is running</li>
            <li>Network connection is working</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
