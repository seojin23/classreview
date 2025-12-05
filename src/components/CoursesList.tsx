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

  // 강의 목록 불러오기
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
      } catch (e: any) {
        console.error(e)
        setError(e.message || '에러 발생')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // 강의별 평점 불러오기
  useEffect(() => {
    if (courses.length === 0) return

    async function fetchRatings() {
      const entries: [string, RatingInfo][] = await Promise.all(
        courses.map(async (course) => {
          try {
            const res = await fetch(`/api/comments?courseId=${course._id}`)
            if (!res.ok) {
              return [course._id, { score: 0, count: 0 }] as [
                string,
                RatingInfo
              ]
            }
            const data = await res.json()
            if (!data.ok || !data.total) {
              return [course._id, { score: 0, count: 0 }] as [
                string,
                RatingInfo
              ]
            }

            const { avgContent, avgHomework, avgExam, total } = data
            const score = (avgContent + avgHomework + avgExam) / 3

            return [course._id, { score, count: total }] as [string, RatingInfo]
          } catch {
            return [course._id, { score: 0, count: 0 }] as [string, RatingInfo]
          }
        })
      )

      setRatings(Object.fromEntries(entries))
    }

    fetchRatings()
  }, [courses])

  if (loading) return <p className="p-4">로딩 중...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="space-y-3">
      {courses.map((course) => {
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
              {course.professor ? course.professor.name : '담당 교수 정보 없음'}
            </div>
            {/* 종합 평점 표시 */}
            <RatingStars score={rating.score} count={rating.count} />\
          </Link>
        )
      })}
    </div>
  )
}
