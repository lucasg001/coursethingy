'use client'

import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-semibold">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="w-32"></div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold mb-4">Admin Features</h2>
          <p className="text-gray-600">Admin functionality coming soon...</p>
        </div>
      </div>
    </div>
  )
}
