'use client'

import React, { useState } from 'react'

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

const colorMap = {
  green: 'border-green-500 bg-green-50',
  amber: 'border-amber-500 bg-amber-50',
  red: 'border-red-500 bg-red-50'
}

const badgeMap = {
  green: 'bg-green-100 text-green-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800'
}

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
  const [frameworkState] = useState<Phase[]>(
    initialFramework || courseFramework
  )

  const getLessonFiles = (lessonNumber: number) => {
    const lesson = lessonFiles.find(l => l.lessonNumber === lessonNumber)
    return lesson ? lesson.files : []
  }

  const removeFile = (lessonNumber: number, idx: number) => {
    setLessonFiles(prev =>
      prev.map(l => {
        if (l.lessonNumber !== lessonNumber) return l
        return { ...l, files: l.files.filter((_, i) => i !== idx) }
      })
    )
  }

  const handleFileUpload = async (lessonNumber: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files || !courseId) return

    setUploading(lessonNumber)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // simulate an upload; in real app you'd send to Supabase
      const newFile = { name: file.name, url: `lesson-${lessonNumber}/${file.name}` }
      setLessonFiles(prev => {
        const existing = prev.find(l => l.lessonNumber === lessonNumber)
        if (existing) {
          return prev.map(l =>
            l.lessonNumber === lessonNumber ? { ...l, files: [...l.files, newFile] } : l
          )
        }
        return [...prev, { lessonNumber, files: [newFile] }]
      })
    }

    setUploading(null)
  }

  return (
    <div>
      {frameworkState.map(phase => (
        <div key={phase.title} className="space-y-6">
          {/* Phase Header */}
          <div className={`border-l-4 ${colorMap[phase.color as keyof typeof colorMap]} p-6 rounded-r-lg`}>
            <div className="flex items-center gap-4 mb-2">
              <span
                className={`text-3xl font-bold ${phase.color === 'green'
                  ? 'text-green-600'
                  : phase.color === 'amber'
                    ? 'text-amber-600'
                    : 'text-red-600'
                  }`}
              >
              </span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{phase.title}</h2>
                <p className="text-gray-600 italic">{phase.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-4">
            {phase.lessons.map(lesson => (
              <div
                key={lesson.number}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-t-4"
                style={{
                  borderTopColor:
                    phase.color === 'green'
                      ? '#22c55e'
                      : phase.color === 'amber'
                        ? '#f59e0b'
                        : '#ef4444'
                }}
              >
                {/* Lesson Number Badge */}
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${badgeMap[phase.color as keyof typeof badgeMap]
                      }`}
                  >
                    Lesson {lesson.number}
                  </span>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded cursor-pointer"
                    style={{
                      accentColor:
                        phase.color === 'green'
                          ? '#22c55e'
                          : phase.color === 'amber'
                            ? '#f59e0b'
                            : '#ef4444'
                    }}
                  />
                </div>

                {/* Lesson Title */}
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{lesson.title}</h3>
                  {courseId && (
                    <a href={`/course/${courseId}/lesson/${lesson.number}`} className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition whitespace-nowrap">
                      Edit Full Lesson
                    </a>
                  )}
                </div>

                {/* Lesson Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {lesson.description}
                </p>

                {/* Materials toggle */}
                <button
                  onClick={() =>
                    setExpandedLesson(expandedLesson === lesson.number ? null : lesson.number)
                  }
                  className="w-full text-left px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-semibold text-sm mb-3"
                >
                  {expandedLesson === lesson.number ? '▼' : '▶'} Lesson Materials
                </button>

                {expandedLesson === lesson.number && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-200">
                    {/* upload area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                      <label className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-2xl">📁</span>
                          <span className="text-sm font-semibold text-gray-700">
                            {uploading === lesson.number
                              ? 'Uploading...'
                              : 'Click to upload files'}
                          </span>
                          <span className="text-xs text-gray-500">
                            Videos, PDFs, slides, etc.
                          </span>
                        </div>
                        <input
                          type="file"
                          multiple
                          onChange={e => handleFileUpload(lesson.number, e)}
                          className="hidden"
                          disabled={uploading === lesson.number}
                        />
                      </label>
                    </div>

                    {/* list files if any */}
                    {getLessonFiles(lesson.number).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-700">Files:</h4>
                        {getLessonFiles(lesson.number).map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-lg">📄</span>
                              <span className="text-sm text-gray-700 truncate">
                                {file.name}
                              </span>
                            </div>
                            <button
                              onClick={() => removeFile(lesson.number, idx)}
                              className="text-red-600 hover:text-red-700 font-semibold text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Quick Reference */}
      {onFrameworkSave && (
        <div className="mt-6 text-center">
          <button
            onClick={() => onFrameworkSave(frameworkState)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Save Framework
          </button>
        </div>
      )}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Quick Reference</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold mt-0.5">Phase 1:</span>
            <span>Build emotional connection and show quick wins (3 lessons)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-0.5">Phase 2:</span>
            <span>Provide in-depth, step-by-step instruction (4 lessons)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-600 font-bold mt-0.5">Phase 3:</span>
            <span>Share advanced knowledge and next steps (3 lessons)</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
