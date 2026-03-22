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
    framework?: string
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    const fetchCourses = async (userId: string) => {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium tracking-wide">
               Generating library layout...
            </div>
        )
    }

    const selectedFramework = selectedCourse ? parseFramework(selectedCourse.framework) : []

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-100 z-10 sticky top-0">
                <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-5 flex justify-between items-center transition-all">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-gray-600 font-bold hover:text-blue-600 transition-colors">
                            Back to Dashboard
                        </Link>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            Personal Library
                        </h1>
                    </div>
                    <div className="bg-gray-100 text-gray-800 font-extrabold px-5 py-2 rounded-full text-sm border border-gray-200 shadow-sm tracking-wide">
                        {user?.email}
                    </div>
                </div>
            </nav>

            <div className="flex-1 max-w-screen-2xl w-full mx-auto flex overflow-hidden h-[calc(100vh-73px)]">

                {/* Sidebar */}
                <div className="w-80 bg-white border-r border-gray-100 overflow-y-auto">
                    <div className="p-8 pb-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
                        <h2 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Stored Content</h2>
                        <p className="text-sm font-bold text-gray-900">{courses.length} Active Courses</p>
                    </div>

                    <div className="p-6 space-y-3">
                        {courses.length === 0 ? (
                            <p className="text-sm text-gray-500 font-medium text-center py-8">No content modules available.</p>
                        ) : (
                            courses.map(course => (
                                <button
                                    key={course.id}
                                    onClick={() => {
                                        setSelectedCourse(course)
                                        setExpandedPhase(null)
                                    }}
                                    className={`w-full text-left p-5 rounded-xl transition-all duration-300 border ${selectedCourse?.id === course.id
                                            ? 'border-blue-200 bg-blue-50 shadow-md transform -translate-y-0.5'
                                            : 'border-transparent hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm'
                                        }`}
                                >
                                    <h3 className={`font-extrabold mb-1 truncate tracking-tight text-lg ${selectedCourse?.id === course.id ? 'text-blue-800' : 'text-gray-900'
                                        }`}>
                                        {course.title}
                                    </h3>
                                    <p className="text-xs font-medium text-gray-500 line-clamp-2 leading-relaxed">{course.description}</p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50 shadow-inner">
                    {selectedCourse ? (
                        <div className="p-10 lg:p-16 max-w-4xl mx-auto">

                            {/* Course Header Info */}
                            <div className="mb-16">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-5">
                                    {selectedCourse.title}
                                </h1>
                                <p className="text-lg font-medium text-gray-600 leading-relaxed max-w-3xl">
                                    {selectedCourse.description}
                                </p>
                            </div>

                            {/* Course Framework Content */}
                            {selectedFramework.length === 0 ? (
                                <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                                    <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">Empty Curriculum</h3>
                                    <p className="text-gray-500 font-medium text-lg">This asset does not have mapped module parameters.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {selectedFramework.map((phase, index) => {
                                        const isExpanded = expandedPhase === phase.title
                                        const getThemeColors = (color: string) => {
                                            switch (color) {
                                                case 'green': return { bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-50 border-emerald-200', tag: 'bg-emerald-100 text-emerald-800' }
                                                case 'amber': return { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50 border-amber-200', tag: 'bg-amber-100 text-amber-800' }
                                                case 'red': return { bg: 'bg-rose-500', text: 'text-rose-700', light: 'bg-rose-50 border-rose-200', tag: 'bg-rose-100 text-rose-800' }
                                                default: return { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50 border-blue-200', tag: 'bg-blue-100 text-blue-800' }
                                            }
                                        }
                                        const theme = getThemeColors(phase.color)

                                        return (
                                            <div
                                                key={phase.title}
                                                className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${isExpanded ? `shadow-lg border-gray-300` : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                                                    }`}
                                            >
                                                {/* Phase Header - Clickable */}
                                                <button
                                                    onClick={() => setExpandedPhase(isExpanded ? null : phase.title)}
                                                    className={`w-full text-left p-8 flex items-center justify-between transition-colors ${isExpanded ? theme.light : 'bg-white'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-3 h-12 rounded-full ${theme.bg}`}></div>
                                                        <div>
                                                            <p className={`text-xs font-extrabold tracking-widest uppercase mb-1.5 ${theme.text}`}>
                                                                Sequence {index + 1}
                                                            </p>
                                                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                                                {phase.title}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                    <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                        <svg className={`w-8 h-8 ${isExpanded ? theme.text : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </button>

                                                <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                                    }`}>
                                                    <div className="p-8 sm:p-10 space-y-8 bg-white border-t border-gray-100">
                                                        {phase.lessons.map((lesson) => (
                                                            <div key={lesson.number} className="group flex gap-8">
                                                                <div className="flex flex-col items-center">
                                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-white shadow-sm transition-transform group-hover:scale-110 ${theme.bg}`}>
                                                                        {lesson.number}
                                                                    </div>
                                                                    <div className="w-0.5 h-full bg-gray-200 my-3 group-last:hidden"></div>
                                                                </div>
                                                                <div className="flex-1 pb-10 group-last:pb-2">
                                                                    <h3 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors tracking-tight">
                                                                        {lesson.title}
                                                                    </h3>
                                                                    <p className="text-gray-600 font-medium leading-relaxed bg-gray-50 rounded-xl p-6 border border-gray-100">
                                                                        {lesson.description}
                                                                    </p>

                                                                    <div className="mt-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button className="text-sm font-bold text-white bg-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm transform hover:-translate-y-0.5">
                                                                            Access Lesson Materials
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
                        <div className="h-full flex flex-col items-center justify-center text-center p-12">
                            <div className="w-24 h-24 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center mb-8">
                                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Library Mainframe Directory</h2>
                            <p className="text-gray-500 max-w-md font-medium text-lg leading-relaxed">
                                Select an active course catalog from the sidebar hierarchy to inspect its instructional phase mapping.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
