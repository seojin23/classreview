// src/components/CoursesList.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import RatingStars from '@/components/comments/RatingStars'

interface Course {
  _id: string
  title: string
  code: string
  credits: number
  professor: {
    _id: string
    name: string
  } | null
}

interface RatingInfo {
  score: number // 종합 평점
  count: number // 평가 참여 수
}

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [ratings, setRatings] = useState<Record<string, RatingInfo>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 검색 상태
  const [query, setQuery] = useState('')
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])

  // 페이지네이션
  const [page, setPage] = useState(1)
  const limit = 10 // 페이지당 항목 수

  // ===============================
  // 1) 강의 목록 불러오기
  // ===============================
  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true)
        const res = await fetch('/api/courses')
        if (!res.ok) {
          throw new Error('강의 목록을 불러오지 못했습니다.')
        }
        const data = await res.json()
        setCourses(data.courses || [])
        setFilteredCourses(data.courses || [])
      } catch (e: any) {
        setError(e.message || '에러 발생')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // ===============================
  // 2) 강의별 평점 불러오기
  // ===============================
  useEffect(() => {
    if (courses.length === 0) return

    async function fetchRatings() {
      const entries: [string, RatingInfo][] = await Promise.all(
        courses.map(async (course) => {
          try {
            const res = await fetch(`/api/comments?courseId=${course._id}`)
            if (!res.ok) return [course._id, { score: 0, count: 0 }]

            const data = await res.json()
            if (!data.ok || !data.data?.stats)
              return [course._id, { score: 0, count: 0 }]

            const stats = data.data.stats
            const score =
              (stats.avgContent + stats.avgHomework + stats.avgExam) / 3

            return [course._id, { score, count: stats.total }]
          } catch {
            return [course._id, { score: 0, count: 0 }]
          }
        })
      )

      setRatings(Object.fromEntries(entries))
    }

    fetchRatings()
  }, [courses])

  // ===============================
  // 3) 검색 기능
  // ===============================
  const handleSearch = () => {
    const q = query.trim().toLowerCase()

    if (!q) {
      setFilteredCourses(courses)
      setPage(1)
      return
    }

    const filtered = courses.filter((c) => {
      const title = c.title?.toLowerCase() || ''
      const prof = c.professor?.name?.toLowerCase() || ''
      return title.includes(q) || prof.includes(q)
    })

    setFilteredCourses(filtered)
    setPage(1)
  }

  // 검색창 enter 키 지원
  const onKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  // ===============================
  // 4) 페이지네이션 (프론트 전용)
  // ===============================
  const start = (page - 1) * limit
  const end = start + limit
  const visibleCourses = filteredCourses.slice(start, end)
  const totalPages = Math.ceil(filteredCourses.length / limit)

  // ===============================
  // 렌더링
  // ===============================
  if (loading) return <p className="p-4">로딩 중...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="space-y-4">
      {/* 검색창 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          placeholder="교수명 / 강의명 검색"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDownSearch}
          className="border p-2 rounded flex-grow"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          검색
        </button>
      </div>

      {/* 강의 리스트 */}
      <div className="space-y-3">
        {visibleCourses.map((course) => {
          const rating = ratings[course._id] || { score: 0, count: 0 }

          return (
            <Link
              key={course._id}
              href={`/courses/${course._id}`}
              className="block border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="font-semibold text-gray-900">{course.title}</h2>
                <span className="text-xs text-gray-500">{course.code}</span>
              </div>

              <div className="text-xs text-gray-600 mb-1">
                {course.professor
                  ? course.professor.name
                  : '담당 교수 정보 없음'}
              </div>

              <RatingStars score={rating.score} count={rating.count} />
            </Link>
          )
        })}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4 justify-center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            이전
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? 'bg-gray-300' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}
