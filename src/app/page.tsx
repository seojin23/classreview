'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CoursesList from '@/components/HomeCoursesList'
import ProfessorsList from '@/components/HomeProfessorsList'

export default function Home() {
  const [keyword, setKeyword] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!keyword.trim()) return
    router.push(`/search?keyword=${keyword}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-end mb-6">
        <Link href="/admin">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition">
            관리자 페이지
          </button>
        </Link>
      </div>

      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          강의 · 교수 검색
        </h1>

        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="강의명 또는 교수명을 입력하세요"
            className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg shadow">
            검색
          </button>
        </form>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📘 강의 목록
          </h2>
          <CoursesList />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            👨‍🏫 교수 목록
          </h2>
          <ProfessorsList />
        </section>
      </div>
    </div>
  )
}
