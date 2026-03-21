'use client'

import { useRouter } from 'next/navigation'
import CourseFramework from '@/components/CourseFramework'
import Link from 'next/link'

export default function FrameworkPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-semibold">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Course Framework</h1>
          <div className="w-32"></div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CourseFramework />

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Close Framework
          </button>
        </div>
      </div>
    </div>
  )
}
