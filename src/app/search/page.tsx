'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Course {
  _id: string
  title: string
  code: string
  credits: number
  professor: { name: string }
}

interface Professor {
  _id: string
  name: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const keyword = searchParams.get('keyword') || ''

  const [courses, setCourses] = useState<Course[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || [])
        setProfessors(data.professors || [])
        setLoading(false)
      })
  }, [keyword])

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin w-10 h-10 border-b-2 border-indigo-600 rounded-full"></div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        검색 결과: "{keyword}"
      </h1>

      <Link
        href="/"
        className="mb-8 bg-gray-800 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700"
      >
        ← 홈으로 이동
      </Link>

      <div className="max-w-6xl w-full space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📘 강의 검색 결과
          </h2>

          {courses.length === 0 ? (
            <div className="w-full py-10 text-center text-gray-500 bg-white border rounded-xl">
              일치하는 강의가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link key={course._id} href={`/courses/${course._id}`}>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition p-6">
                    <h3 className="text-lg font-bold text-indigo-600 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600">코드: {course.code}</p>
                    <p className="text-sm text-gray-600">
                      학점: {course.credits}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      담당 교수: {course.professor?.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            👨‍🏫 교수 검색 결과
          </h2>

          {professors.length === 0 ? (
            <div className="w-full py-10 text-center text-gray-500 bg-white border rounded-xl">
              일치하는 교수가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {professors.map((prof) => (
                <Link key={prof._id} href={`/professors/${prof._id}`}>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition p-6 text-center">
                    <h3 className="text-lg font-bold text-indigo-600 mb-2">
                      {prof.name} 교수님
                    </h3>
                    <p className="text-sm text-gray-500">교수 상세보기 →</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
