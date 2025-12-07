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
  score: number
  count: number
}

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [ratings, setRatings] = useState<Record<string, RatingInfo>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])

  const [page, setPage] = useState(1)
  const limit = 10

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true)
        const res = await fetch('/api/courses')
        if (!res.ok) throw new Error('강의 목록을 불러오지 못했습니다.')
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

  // ============================================
  // 검색 기능
  // ============================================
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

      if (category === 'title') return title.includes(q)
      if (category === 'professor') return prof.includes(q)
      return title.includes(q) || prof.includes(q)
    })

    setFilteredCourses(filtered)
    setPage(1)
  }

  const onKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const start = (page - 1) * limit
  const end = start + limit
  const visibleCourses = filteredCourses.slice(start, end)
  const totalPages = Math.ceil(filteredCourses.length / limit)

  if (loading) return <p className="loading-text">로딩 중...</p>
  if (error) return <p className="error-text">{error}</p>

  return (
    <div className="course-list-wrapper">
      {/* 검색창 */}
      <div className="search-bar">
        <select
          aria-label="aaa"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="search-select"
        >
          <option value="all">전체</option>
          <option value="title">강의명</option>
          <option value="professor">교수명</option>
        </select>

        <input
          type="text"
          value={query}
          placeholder="검색어 입력"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDownSearch}
          className="search-input"
        />

        <button onClick={handleSearch} className="search-btn">
          검색
        </button>
      </div>

      {/* 강의 리스트 */}
      <div className="course-list">
        {visibleCourses.map((course) => {
          const rating = ratings[course._id] || { score: 0, count: 0 }

          return (
            <Link
              key={course._id}
              href={`/courses/${course._id}`}
              className="course-card"
            >
              {/* 제목 + 교수명 */}
              <div className="course-header">
                <h2 className="course-title">{course.title}</h2>

                <span className="course-prof-inline">
                  {course.professor ? course.professor.name : '담당 교수 없음'}
                </span>
              </div>

              {/* 별점 또는 평가 없음 */}
              <div className="course-rating-area">
                <RatingStars score={rating.score} count={rating.count} />
              </div>

              {/* 과목 코드 오른쪽 아래 */}
              <div className="course-code-area">
                <span className="course-code">{course.code}</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="page-btn"
          >
            이전
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`page-index ${page === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="page-btn"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}
