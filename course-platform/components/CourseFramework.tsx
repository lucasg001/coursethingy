'use client'

import React, { useState, useCallback, memo } from 'react'

export interface Phase {
  color: string
  title: string
  subtitle: string
  lessons: {
    number: number
    title: string
    description: string
  }[]
}

interface LessonFile {
  lessonNumber: number
  files: { name: string; url: string }[]
}

export const courseFramework: Phase[] = [
  {
    color: 'green',
    title: 'Insert Your Title Here',
    subtitle: 'Inser Your Subtitle Here',
    lessons: [
      {
        number: 1,
        title: 'The Promise',
        description: 'A 2-minute "Welcome" video. Tell them exactly what they will achieve and why you are the one to teach them.'
      },
      {
        number: 2,
        title: 'The Fast Win',
        description: 'Give them one small thing they can do today to see progress. (e.g., "Change this one setting on your profile")'
      },
      {
        number: 3,
        title: 'The Gear/Tool List',
        description: 'List every app, website, or piece of equipment you use. No gatekeeping.'
      }
    ]
  },
  {
    color: 'amber',
    title: 'Phase 2: The Meat',
    subtitle: 'The "How-To"',
    lessons: [
      {
        number: 4,
        title: 'The Roadmap',
        description: 'A high-level overview of your process. (e.g., "The 3 steps I use to edit every video")'
      },
      {
        number: 5,
        title: 'Deep Dive (Step 1)',
        description: 'Focus on the beginning of the process. Show your screen or show your hands.'
      },
      {
        number: 6,
        title: 'Deep Dive (Step 2)',
        description: 'Focus on the "middle" where people usually get stuck.'
      },
      {
        number: 7,
        title: 'Deep Dive (Step 3)',
        description: 'Focus on finishing and "polishing" the work.'
      }
    ]
  },
  {
    color: 'red',
    title: 'Phase 3: The Pro Secrets',
    subtitle: 'The "Value"',
    lessons: [
      {
        number: 8,
        title: 'The "Don\'t Do This" List',
        description: 'Share the 3 biggest mistakes you made when you started so they can skip the pain.'
      },
      {
        number: 9,
        title: 'The Shortcut',
        description: 'Share your templates, scripts, or "cheat sheets" that make the process 10x faster.'
      },
      {
        number: 10,
        title: 'Graduation',
        description: 'What should they do next? How do they keep the momentum going?'
      }
    ]
  }
]

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; accent: string; badgeBd: string; badgeText: string }> = {
  green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600', accent: 'accent-green-500', badgeBd: 'bg-green-100', badgeText: 'text-green-800' },
  amber: { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-600', accent: 'accent-amber-500', badgeBd: 'bg-amber-100', badgeText: 'text-amber-800' },
  red:   { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-600', accent: 'accent-red-500', badgeBd: 'bg-red-100', badgeText: 'text-red-800' }
}

// Memoized LessonCard to prevent unnecessary re-renders when other lessons change state
const LessonCard = memo(function LessonCard({
  lesson,
  phaseColor,
  courseId,
  isExpanded,
  isUploading,
  files,
  onToggleExpand,
  onFileUpload,
  onRemoveFile
}: {
  lesson: Phase['lessons'][0]
  phaseColor: string
  courseId?: string
  isExpanded: boolean
  isUploading: boolean
  files: { name: string; url: string }[]
  onToggleExpand: (lessonNumber: number) => void
  onFileUpload: (lessonNumber: number, e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: (lessonNumber: number, idx: number) => void
}) {
  const styles = COLOR_MAP[phaseColor] || COLOR_MAP.green

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border-t-4 ${styles.border} flex flex-col h-full`}>
      {/* Lesson Number Badge & Checkbox */}
      <div className="flex items-start justify-between mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase ${styles.badgeBd} ${styles.badgeText} shadow-sm`}>
          Lesson {lesson.number}
        </span>
        <input
          type="checkbox"
          className={`w-5 h-5 rounded cursor-pointer transition-colors`}
          style={{ accentColor: phaseColor === 'green' ? '#22c55e' : phaseColor === 'amber' ? '#f59e0b' : '#ef4444' }} // Fallback for browsers
        />
      </div>

      {/* Lesson Title & Edit */}
      <div className="flex justify-between items-start mb-3 gap-3">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-snug">{lesson.title}</h3>
        {courseId && (
          <a
            href={`/course/${courseId}/lesson/${lesson.number}`}
            className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors whitespace-nowrap shadow-sm border border-blue-100"
          >
            Edit
          </a>
        )}
      </div>

      {/* Lesson Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
        {lesson.description}
      </p>

      {/* Materials Toggle */}
      <button
        onClick={() => onToggleExpand(lesson.number)}
        className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all font-semibold text-sm flex items-center justify-between group border border-transparent hover:border-gray-200"
      >
        <span>Lesson Materials {files.length > 0 && <span className="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">{files.length}</span>}</span>
        <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
          <svg className={`w-6 h-6 transform transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Expanded Actions */}
      {isExpanded && (
        <div className="mt-3 bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100 transition-all origin-top">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all group cursor-pointer relative overflow-hidden">
            <input
              type="file"
              multiple
              onChange={(e) => onFileUpload(lesson.number, e)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isUploading}
            />
            <div className="flex flex-col items-center gap-2 relative z-0">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform duration-300 mb-2">+</div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                {isUploading ? 'Uploading...' : 'Click or drop files'}
              </span>
              <span className="text-xs text-gray-500">Videos, PDFs, slides, etc.</span>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2 mt-4">
              <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Attached Files</h4>
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-100 shadow-sm hover:border-gray-300 transition-colors group/file">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-gray-400 font-bold text-xs uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">File</span>
                      <span className="text-sm font-medium text-gray-700 truncate group-hover/file:text-blue-600 transition-colors">
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveFile(lesson.number, idx)}
                      className="text-gray-400 hover:text-red-600 font-bold p-1 rounded-md hover:bg-red-50 transition-colors focus:outline-none"
                      aria-label="Remove file"
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

export default function CourseFramework({
  courseId,
  initialFramework,
  onFrameworkSave,
}: {
  courseId?: string
  initialFramework?: Phase[]
  onFrameworkSave?: (updated: Phase[]) => void
}) {
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null)
  const [lessonFiles, setLessonFiles] = useState<LessonFile[]>([])
  const [uploading, setUploading] = useState<number | null>(null)
  const [frameworkState] = useState<Phase[]>(initialFramework || courseFramework)

  // UseCallback prevents recreating handlers on every render
  const handleToggleExpand = useCallback((lessonNumber: number) => {
    setExpandedLesson(prev => prev === lessonNumber ? null : lessonNumber)
  }, [])

  const handleFileUpload = useCallback(async (lessonNumber: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files || !courseId) return

    setUploading(lessonNumber)

    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      url: `lesson-${lessonNumber}/${file.name}`
    }))

    setLessonFiles(prev => {
      const existing = prev.find(l => l.lessonNumber === lessonNumber)
      if (existing) {
        return prev.map(l =>
          l.lessonNumber === lessonNumber ? { ...l, files: [...l.files, ...newFiles] } : l
        )
      }
      return [...prev, { lessonNumber, files: newFiles }]
    })

    setUploading(null)
  }, [courseId])

  const handleRemoveFile = useCallback((lessonNumber: number, idx: number) => {
    setLessonFiles(prev =>
      prev.map(l => {
        if (l.lessonNumber !== lessonNumber) return l
        return { ...l, files: l.files.filter((_, i) => i !== idx) }
      })
    )
  }, [])

  // Helper function to extract correct files per lesson
  const getLessonFiles = useCallback((lessonNumber: number) => {
    return lessonFiles.find(l => l.lessonNumber === lessonNumber)?.files || []
  }, [lessonFiles])

  return (
    <div className="space-y-12">
      {frameworkState.map(phase => {
        const styles = COLOR_MAP[phase.color] || COLOR_MAP.green

        return (
          <div key={phase.title} className="space-y-8">
            {/* Phase Header */}
            <div className={`border-l-4 ${styles.border} ${styles.bg} p-8 rounded-r-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4`}>
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{phase.title}</h2>
                  <p className="text-gray-600 font-medium text-lg mt-1 opacity-90">{phase.subtitle}</p>
                </div>
              </div>
              <div className={`hidden md:flex px-4 py-2 rounded-full font-bold text-sm tracking-widest uppercase ${styles.badgeBd} ${styles.text}`}>
                {phase.lessons.length} Lessons
              </div>
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 px-2 md:px-0">
              {phase.lessons.map(lesson => (
                <LessonCard
                  key={lesson.number}
                  lesson={lesson}
                  phaseColor={phase.color}
                  courseId={courseId}
                  isExpanded={expandedLesson === lesson.number}
                  isUploading={uploading === lesson.number}
                  files={getLessonFiles(lesson.number)}
                  onToggleExpand={handleToggleExpand}
                  onFileUpload={handleFileUpload}
                  onRemoveFile={handleRemoveFile}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* Quick Reference */}
      {onFrameworkSave && (
        <div className="mt-12 text-center pt-8 border-t border-gray-200">
          <button
            onClick={() => onFrameworkSave(frameworkState)}
            className="bg-blue-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1 text-lg"
          >
            Save Framework Configuration
          </button>
        </div>
      )}
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-8 rounded-r-xl mt-16 shadow-sm">
        <h3 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center font-black">!</span> Quick Reference
        </h3>
        <ul className="space-y-4 text-gray-700 text-lg">
          <li className="flex items-start gap-4">
            <span className="text-green-600 font-bold mt-0.5 bg-green-100 px-3 flex items-center justify-center rounded-md">Phase 1</span>
            <span className="leading-relaxed">Build emotional connection and show quick wins (3 lessons)</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-amber-600 font-bold mt-0.5 bg-amber-100 px-3 flex items-center justify-center rounded-md">Phase 2</span>
            <span className="leading-relaxed">Provide in-depth, step-by-step instruction (4 lessons)</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-red-600 font-bold mt-0.5 bg-red-100 px-3 flex items-center justify-center rounded-md">Phase 3</span>
            <span className="leading-relaxed">Share advanced knowledge and next steps (3 lessons)</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
