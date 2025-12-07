'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface Course {
  _id: string
  title: string
  code: string
  credits: number
  professor: {
    name: string
  }
}

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`)
      .then((res) => {
        if (!res.ok) throw new Error('데이터 조회 실패')
        return res.json()
      })
      .then((data) => {
        setCourses(data.courses || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>로딩 중...</p>
  if (error) return <p>오류: {error}</p>

  return (
    <ul>
      {courses.map((course) => (
        <li key={course._id}>
          <Link href={`/courses/${course._id}`}>
            <p>
              <strong>{course.title}</strong> ({course.code}) - {course.credits}
              학점 - 담당 교수: {course.professor?.name}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
