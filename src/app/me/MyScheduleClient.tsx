// src/app/me/MyScheduleClient.tsx
'use client'

import { useEffect, useState } from 'react'

interface Course {
  _id: string
  title: string
  code: string
}

interface Enrollment {
  _id: string
  course: Course
}

export default function MyScheduleClient() {
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [myEnrollments, setMyEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadData() {
    try {
      setLoading(true)
      setError(null)

      // 내 시간표
      const resEnroll = await fetch('/api/enrollments')
      if (!resEnroll.ok) {
        throw new Error('내 시간표를 불러오지 못했습니다.')
      }
      const enrollData = await resEnroll.json()

      // 전체 강의 목록
      const resCourses = await fetch('/api/courses')
      if (!resCourses.ok) {
        throw new Error('강의 목록을 불러오지 못했습니다.')
      }
      const courseData = await resCourses.json()

      setMyEnrollments(enrollData.enrollments ?? [])
      setAllCourses(courseData.courses ?? [])
    } catch (e: any) {
      setError(e.message ?? '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function addCourse(courseId: string) {
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.message ?? '추가 실패')
        return
      }

      await loadData()
    } catch {
      alert('추가 중 오류가 발생했습니다.')
    }
  }

  async function removeEnrollment(id: string) {
    try {
      const res = await fetch(`/api/enrollments?id=${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.message ?? '삭제 실패')
        return
      }

      await loadData()
    } catch {
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading) return <p className="text-sm text-gray-500">불러오는 중...</p>
  if (error) return <p className="text-sm text-red-500">{error}</p>

  // 이미 시간표에 있는 강의 ID 집합
  const enrolledIds = new Set(myEnrollments.map((e) => e.course?._id))

  // 아직 신청 안 한 강의 목록
  const remainingCourses = allCourses.filter((c) => !enrolledIds.has(c._id))

  return (
    <div className="space-y-4">
      {/* 내 시간표 */}
      <div>
        <h3 className="font-semibold mb-2">내 시간표</h3>
        {myEnrollments.length === 0 ? (
          <p className="text-sm text-gray-500">아직 담은 강의가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {myEnrollments.map((en) => (
              <li
                key={en._id}
                className="flex justify-between items-center border rounded px-3 py-2 text-sm"
              >
                <span>
                  {en.course?.title} ({en.course?.code})
                </span>
                <button
                  className="text-xs text-red-500 underline"
                  onClick={() => removeEnrollment(en._id)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 강의 추가 */}
      <div>
        <h3 className="font-semibold mb-2">강의 추가</h3>
        {remainingCourses.length === 0 ? (
          <p className="text-sm text-gray-500">
            추가할 수 있는 강의가 없습니다.
          </p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto border rounded p-2">
            {remainingCourses.map((c) => (
              <li
                key={c._id}
                className="flex justify-between items-center text-sm"
              >
                <span>
                  {c.title} ({c.code})
                </span>
                <button
                  className="text-xs text-blue-500 underline"
                  onClick={() => addCourse(c._id)}
                >
                  추가
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
