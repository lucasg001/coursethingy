'use client'

import { useRouter } from 'next/navigation'
import CourseFramework from '@/components/CourseFramework'
import Link from 'next/link'

export default function FrameworkPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex justify-between items-center transition-all">
          <Link href="/dashboard" className="text-gray-600 font-bold hover:text-blue-600 transition-colors">
            Return to Dashboard
          </Link>
          <div className="bg-gray-100 text-gray-800 font-extrabold px-5 py-2 rounded-full text-sm border border-gray-200 shadow-sm tracking-wide">
            Global Framework Editor
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-12">
           <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Master Course Architecture</h2>
           <p className="text-lg font-medium text-gray-500">Global standalone testing laboratory for structural phase planning.</p>
        </div>

        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 mb-12">
           <CourseFramework />
        </div>

        <div className="text-center pt-8 border-t border-gray-200">
          <button
            onClick={() => router.back()}
            className="bg-gray-900 text-white font-extrabold px-10 py-4 rounded-xl hover:bg-gray-800 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-lg"
          >
            Close Framework Interface
          </button>
        </div>
      </div>
    </div>
  )
}
