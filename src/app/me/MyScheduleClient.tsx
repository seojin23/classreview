'use client'

import React, { useEffect, useMemo, useState } from 'react'

type ProfessorPopulated =
  | {
      _id?: string
      name?: string
      department?: string
    }
  | string
  | null
  | undefined

type CourseInEnrollment = {
  _id: string
  title: string
  code: string
  professor?: ProfessorPopulated
}

type EnrollmentItem = {
  _id: string
  course: CourseInEnrollment
  createdAt?: string
}

type CourseItem = {
  _id: string
  title: string
  code: string
  professor?: ProfessorPopulated
}

export default function MyScheduleClient() {
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([])
  const [allCourses, setAllCourses] = useState<CourseItem[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  // 공통으로 쓰는 교수 이름 추출 함수
  const getProfessorName = (prof: ProfessorPopulated): string => {
    if (!prof) return '미정'
    if (typeof prof === 'string') return prof
    if (typeof prof === 'object' && 'name' in prof && prof.name) {
      return prof.name
    }
    return '미정'
  }

  // 🔹 처음 로딩 시 내 시간표 + 전체 강의 목록 불러오기
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true)
        const [enrollRes, courseRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enrollments`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`),
        ])

        const enrollJson = await enrollRes.json()
        const courseJson = await courseRes.json()

        setEnrollments(enrollJson.enrollments ?? [])
        setAllCourses(courseJson.courses ?? [])
      } catch (error) {
        console.error('초기 데이터 로딩 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitial()
  }, [])

  // 🔹 검색어 필터링
  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return allCourses

    return allCourses.filter((c) => {
      const title = c.title?.toLowerCase() ?? ''
      const code = c.code?.toLowerCase() ?? ''
      const profName = getProfessorName(c.professor ?? '').toLowerCase()
      return title.includes(q) || code.includes(q) || profName.includes(q)
    })
  }, [allCourses, search])

  // 🔹 현재 시간표에 이미 들어있는 강의인지 체크
  const isInSchedule = (courseId: string) =>
    enrollments.some((e) => e.course && e.course._id === courseId)

  // 🔹 강의 시간표에 추가
  const handleAdd = async (courseId: string) => {
    try {
      setLoading(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId }), // ✅ backend가 기대하는 필드 이름
        }
      )

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err.message ?? '시간표 추가 중 오류가 발생했습니다.')
        return
      }

      // ✅ 새로고침 없이도 바로 반영되도록, 전체 시간표 다시 GET
      const enrollRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments`
      )
      const enrollJson = await enrollRes.json()
      setEnrollments(enrollJson.enrollments ?? [])
    } catch (error) {
      console.error('시간표 추가 오류:', error)
      alert('시간표 추가 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 시간표에서 삭제
  const handleRemove = async (enrollmentId: string) => {
    try {
      setLoading(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments?id=${enrollmentId}`,
        {
          method: 'DELETE',
        }
      )

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err.message ?? '삭제 중 오류가 발생했습니다.')
        return
      }

      // 삭제 후에도 GET으로 다시 동기화
      const enrollRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments`
      )
      const enrollJson = await enrollRes.json()
      setEnrollments(enrollJson.enrollments ?? [])
    } catch (error) {
      console.error('시간표 삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {/* 왼쪽: 내 시간표 */}
      <div className="w-full md:w-1/2">
        <h3 className="mb-2 text-lg font-semibold">내 시간표</h3>

        {enrollments.length === 0 ? (
          <p className="text-sm text-gray-500">
            아직 시간표에 추가한 강의가 없습니다.
          </p>
        ) : (
          <ul className="space-y-3">
            {enrollments.map((e) => (
              <li
                key={e._id}
                className="flex items-center justify-between gap-3 rounded border px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">
                    {e.course?.title} ({e.course?.code})
                  </div>
                  <div className="truncate text-sm text-gray-500">
                    담당:{' '}
                    {getProfessorName(
                      (e.course && e.course.professor) ?? undefined
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(e._id)}
                  className="rounded bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
                  disabled={loading}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 오른쪽: 검색 후 시간표에 추가 */}
      <div className="w-full md:w-1/2">
        <h3 className="mb-2 text-lg font-semibold">시간표에 추가</h3>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="강의명 / 코드 / 교수명으로 검색"
          className="mb-3 w-full rounded border px-3 py-2 text-sm outline-none"
        />

        {filteredCourses.length === 0 ? (
          <p className="text-sm text-gray-500">조건에 맞는 강의가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {filteredCourses.map((c) => {
              const inSchedule = isInSchedule(c._id)
              return (
                <li
                  key={c._id}
                  className="flex items-center justify-between gap-3 rounded border px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">
                      {c.title} ({c.code})
                    </div>
                    <div className="truncate text-sm text-gray-500">
                      담당: {getProfessorName(c.professor ?? undefined)}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={loading || inSchedule}
                    onClick={() => {
                      if (!inSchedule) handleAdd(c._id)
                    }}
                    className={`rounded px-4 py-2 text-sm font-medium text-white ${
                      inSchedule
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {inSchedule ? '시간표에 추가됨' : '시간표에 추가'}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
