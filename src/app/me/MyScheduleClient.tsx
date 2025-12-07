// src/app/me/MyScheduleClient.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type ProfessorObj = {
  _id: string
  name: string
  department?: string
  email?: string
}

type CourseLite = {
  _id: string
  title: string
  code: string
  // 문자열일 수도, 객체일 수도 있다고 가정
  professor?: string | ProfessorObj
}

type Enrollment = {
  _id: string
  course: CourseLite
}

// 🔹 교수 이름 뽑는 헬퍼 함수
function getProfessorName(prof?: string | ProfessorObj) {
  if (!prof) return undefined
  if (typeof prof === 'string') return prof
  return prof.name // 객체일 때는 name만 사용
}

export default function MyScheduleClient() {
  const [courses, setCourses] = useState<CourseLite[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, enrollRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/enrollments'),
        ])

        const courseJson = await courseRes.json()
        const enrollJson = await enrollRes.json()

        setCourses(courseJson.courses ?? [])
        setEnrollments(enrollJson.enrollments ?? [])
      } catch (error) {
        console.error('시간표 데이터 로딩 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredCourses = courses.filter((c) => {
    if (!search.trim()) return true
    const q = search.trim().toLowerCase()
    const profName = getProfessorName(c.professor)?.toLowerCase() ?? ''
    return (
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      profName.includes(q)
    )
  })

  const isEnrolled = (courseId: string) =>
    enrollments.some((e) => e.course._id === courseId)

  const handleAdd = async (courseId: string) => {
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: courseId }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err.message ?? '시간표 추가 중 오류가 발생했습니다.')
        return
      }

      const data = await res.json()
      if (data.enrollment) {
        setEnrollments((prev) => [...prev, data.enrollment])
      } else {
        const enrollRes = await fetch('/api/enrollments')
        const enrollJson = await enrollRes.json()
        setEnrollments(enrollJson.enrollments ?? [])
      }
    } catch (error) {
      console.error('시간표 추가 오류:', error)
      alert('시간표 추가 중 오류가 발생했습니다.')
    }
  }

  const handleRemove = async (enrollmentId: string) => {
    try {
      const res = await fetch(`/api/enrollments?id=${enrollmentId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err.message ?? '시간표 삭제 중 오류가 발생했습니다.')
        return
      }

      setEnrollments((prev) => prev.filter((e) => e._id !== enrollmentId))
    } catch (error) {
      console.error('시간표 삭제 오류:', error)
      alert('시간표 삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500 mt-2">시간표 로딩 중...</p>
  }

  return (
    <div className="mt-2 grid gap-6 md:grid-cols-2">
      {/* 왼쪽: 내 시간표 */}
      <section>
        <h3 className="font-semibold mb-2">내 시간표</h3>
        {enrollments.length === 0 ? (
          <p className="text-sm text-gray-500">
            아직 시간표에 추가한 강의가 없습니다.
          </p>
        ) : (
          <ul className="space-y-2">
            {enrollments.map((e) => {
              const profName = getProfessorName(e.course.professor)
              return (
                <li
                  key={e._id}
                  className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                >
                  <div>
                    <div className="font-medium">
                      <Link
                        href={`/courses/${e.course._id}`}
                        className="underline"
                      >
                        {e.course.title}
                      </Link>{' '}
                      ({e.course.code})
                    </div>
                    {profName && (
                      <div className="text-xs text-gray-500">
                        담당: {profName}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(e._id)}
                    className="text-xs rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                  >
                    삭제
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* 오른쪽: 강의 검색 + 시간표에 추가 */}
      <section>
        <h3 className="font-semibold mb-2">강의 검색 후 시간표에 추가</h3>

        <div className="mb-3 flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="강의명 / 코드 / 교수명으로 검색"
            className="flex-1 rounded border px-3 py-2 text-sm outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs text-gray-500 hover:underline"
            >
              초기화
            </button>
          )}
        </div>

        {filteredCourses.length === 0 ? (
          <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
        ) : (
          <ul className="space-y-2 max-h-72 overflow-y-auto">
            {filteredCourses.map((c) => {
              const already = isEnrolled(c._id)
              const enrollment = enrollments.find((e) => e.course._id === c._id)
              const profName = getProfessorName(c.professor)

              return (
                <li
                  key={c._id}
                  className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                >
                  <div>
                    <div className="font-medium">
                      {c.title} ({c.code})
                    </div>
                    {profName && (
                      <div className="text-xs text-gray-500">
                        담당: {profName}
                      </div>
                    )}
                  </div>
                  {already && enrollment ? (
                    <button
                      onClick={() => handleRemove(enrollment._id)}
                      className="text-xs rounded bg-gray-300 px-2 py-1 text-gray-800 hover:bg-gray-400"
                    >
                      시간표에서 제거
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAdd(c._id)}
                      className="text-xs rounded bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
                    >
                      시간표에 추가
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
