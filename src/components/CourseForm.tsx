'use client'

import { useState, useEffect } from 'react'

interface ProfessorOption {
  _id: string
  name: string
  department: string
}

export default function CourseForm() {
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [credits, setCredits] = useState(3)
  const [professorId, setProfessorId] = useState('')
  const [professors, setProfessors] = useState<ProfessorOption[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professors`)
      .then((res) => res.json())
      .then((data) => setProfessors(data.professors || []))
      .catch(() => setProfessors([]))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, code, credits, professor: professorId }),
    })

    if (res.ok) {
      setMessage('강의가 성공적으로 추가되었습니다.')
      setTitle('')
      setCode('')
      setCredits(3)
      setProfessorId('')
    } else {
      setMessage('오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          강의명
        </label>
        <input
          className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">코드</label>
        <input
          className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">학점</label>
        <input
          className="mt-1 block w-28 rounded-md border border-gray-200 px-3 py-2 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          type="number"
          min={1}
          max={10}
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          담당 교수
        </label>
        <select
          className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={professorId}
          onChange={(e) => setProfessorId(e.target.value)}
          required
        >
          <option value="">선택하세요</option>
          {professors.map((prof) => (
            <option key={prof._id} value={prof._id}>
              {prof.name}: {prof.department}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          → 추가
        </button>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </form>
  )
}
