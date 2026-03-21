'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Phase } from '@/components/CourseFramework'

interface Course {
    id: string
    title: string
    description: string
    video_url?: string
    framework?: string // JSON string of Phase[]
    instructor_id: string
}

export default function LibraryPage() {
    const [user, setUser] = useState<User | null>(null)
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [expandedPhase, setExpandedPhase] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }
            setUser(session.user)
            await fetchCourses(session.user.id)
        }
        init()
    }, [router])

    const fetchCourses = async (userId: string) => {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            // Fetch all courses for the user, assuming they are the instructor for now
            .eq('instructor_id', userId)

        if (!error && data) {
            setCourses(data)
            if (data.length > 0) {
                setSelectedCourse(data[0])
            }
        }
        setLoading(false)
    }

    const parseFramework = (frameworkStr?: string): Phase[] => {
        if (!frameworkStr) return []
        try {
            return JSON.parse(frameworkStr)
        } catch {
            return []
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    const selectedFramework = selectedCourse ? parseFramework(selectedCourse.framework) : []

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation */}
            <nav className="bg-white shadow z-10">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 transition">
                            ← Back to Dashboard
                        </Link>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            My Library
                        </h1>
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                        {user?.email}
                    </div>
                </div>
            </nav>

            <div className="flex-1 max-w-screen-2xl w-full mx-auto flex overflow-hidden h-[calc(100vh-73px)]">

                {/* Sidebar */}
                <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-6 pb-2 border-b border-gray-200 sticky top-0 bg-white">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Content</h2>
                        <p className="text-sm text-gray-600">{courses.length} courses available</p>
                    </div>

                    <div className="p-4 space-y-2">
                        {courses.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-8">No content found.</p>
                        ) : (
                            courses.map(course => (
                                <button
                                    key={course.id}
                                    onClick={() => {
                                        setSelectedCourse(course)
                                        setExpandedPhase(null)
                                    }}
                                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${selectedCourse?.id === course.id
                                            ? 'border-blue-200 bg-blue-50/50 shadow-sm ring-1 ring-blue-500/20'
                                            : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
                                        }`}
                                >
                                    <h3 className={`font-semibold mb-1 truncate ${selectedCourse?.id === course.id ? 'text-blue-700' : 'text-gray-900'
                                        }`}>
                                        {course.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 line-clamp-2">{course.description}</p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    {selectedCourse ? (
                        <div className="p-8 lg:p-12 max-w-4xl mx-auto">

                            {/* Course Header Info */}
                            <div className="mb-12">
                                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                                    {selectedCourse.title}
                                </h1>
                                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                                    {selectedCourse.description}
                                </p>
                            </div>

                            {/* Course Framework Content */}
                            {selectedFramework.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                                    <span className="text-4xl mb-4 block">📭</span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Content Yet</h3>
                                    <p className="text-gray-500">This course doesn't have any lessons configured.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {selectedFramework.map((phase, index) => {
                                        const isExpanded = expandedPhase === phase.title
                                        // Map color strings to tailwind utilities safely
                                        const getThemeColors = (color: string) => {
                                            switch (color) {
                                                case 'green': return { bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-50 border-emerald-200', icon: '🟢' }
                                                case 'amber': return { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50 border-amber-200', icon: '🟡' }
                                                case 'red': return { bg: 'bg-rose-500', text: 'text-rose-700', light: 'bg-rose-50 border-rose-200', icon: '🔴' }
                                                default: return { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50 border-blue-200', icon: '🔵' }
                                            }
                                        }
                                        const theme = getThemeColors(phase.color)

                                        return (
                                            <div
                                                key={phase.title}
                                                className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${isExpanded ? `ring-2 ring-opacity-20 ${theme.light.split(' ')[1].replace('border-', 'ring-')}` : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {/* Phase Header - Clickable */}
                                                <button
                                                    onClick={() => setExpandedPhase(isExpanded ? null : phase.title)}
                                                    className={`w-full text-left p-6 sm:px-8 flex items-center justify-between transition-colors ${isExpanded ? theme.light : 'bg-white'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <span className="text-3xl filter drop-shadow-sm">{theme.icon}</span>
                                                        <div>
                                                            <p className={`text-sm font-bold tracking-widest uppercase mb-1 ${theme.text}`}>
                                                                Phase {index + 1}
                                                            </p>
                                                            <h2 className="text-xl font-bold text-gray-900">
                                                                {phase.title}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                    <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                        <svg className={`w-6 h-6 ${isExpanded ? theme.text : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </button>

                                                {/* Phase Lessons - Animated collapse equivalent */}
                                                <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                                    }`}>
                                                    <div className="p-6 sm:p-8 space-y-6 bg-white border-t border-gray-100">
                                                        {phase.lessons.map((lesson) => (
                                                            <div key={lesson.number} className="group flex gap-6">
                                                                <div className="flex flex-col items-center">
                                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm transition-transform group-hover:scale-110 ${theme.bg}`}>
                                                                        {lesson.number}
                                                                    </div>
                                                                    <div className="w-px h-full bg-gray-200 my-2 group-last:hidden"></div>
                                                                </div>
                                                                <div className="flex-1 pb-8 group-last:pb-2">
                                                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                                        {lesson.title}
                                                                    </h3>
                                                                    <p className="text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                                        {lesson.description}
                                                                    </p>

                                                                    {/* Dummy Button for "Watch Video" or "View Files" */}
                                                                    <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                                                                            ▶ Start Lesson
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <span className="text-4xl">📚</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Library</h2>
                            <p className="text-gray-500 max-w-md">
                                Select a course from the sidebar to view its content, phases, and lessons.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
