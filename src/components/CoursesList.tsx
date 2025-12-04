'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import RatingStars from './RatingStarts'

interface Course {
  _id: string
  title: string
  code: string
  credits: number
  professor: { name: string }
  rating?: number
}

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [displayed, setDisplayed] = useState<Course[]>([])

  // 검색 상태
  const [searchBy, setSearchBy] = useState('title')
  const [searchValue, setSearchValue] = useState('')

  // 페이지네이션
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10 // or 20 설정 가능

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`)
      .then((res) => res.json())
      .then((data) => {
        // ⭐ mock rating 자동 생성
        const withRating = data.courses.map((c: Course) => ({
          ...c,
          rating: Math.round(Math.random() * 4 + 1), // 1~5 랜덤 평점
        }))
        setCourses(withRating)
        setDisplayed(withRating)
      })
  }, [])

  const handleSearch = () => {
    const filtered = courses.filter((course) => {
      const keyword = searchValue.toLowerCase()
      if (searchBy === 'title')
        return course.title.toLowerCase().includes(keyword)
      else return course.professor.name.toLowerCase().includes(keyword)
    })

    setDisplayed(filtered)
    setPage(1) // 검색 후 페이지 초기화
  }

  // 현재 페이지 데이터
  const start = (page - 1) * PAGE_SIZE
  const currentPageData = displayed.slice(start, start + PAGE_SIZE)
  const totalPages = Math.ceil(displayed.length / PAGE_SIZE)

  return (
    <div className="space-y-6">
      {/* 검색 */}
      <div className="flex gap-3 items-center">
        <select
          aria-label="검색 기준"
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="title">강의명</option>
          <option value="professor">교수명</option>
        </select>

        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="검색어 입력"
          className="border p-2 rounded-md w-60"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          검색
        </button>
      </div>

      {/* 테이블 */}
      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3 text-left">강의명</th>
            <th className="border p-3">교수</th>
            <th className="border p-3">학점</th>
            <th className="border p-3">평점</th>
          </tr>
        </thead>

        <tbody>
          {currentPageData.map((course) => (
            <tr key={course._id} className="hover:bg-gray-50 transition">
              <td className="border p-3 text-blue-600 font-medium">
                <Link href={`/courses/${course._id}`}>{course.title}</Link>
              </td>
              <td className="border p-3">{course.professor.name}</td>
              <td className="border p-3">{course.credits}</td>
              <td className="border p-3">
                <RatingStars rating={course.rating!} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-2 border rounded disabled:opacity-30"
        >
          이전
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-2 border rounded disabled:opacity-30"
        >
          다음
        </button>
      </div>
    </div>
  )
}
