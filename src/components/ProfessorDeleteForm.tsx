'use client'

import { useState, useEffect } from 'react'

interface Professor {
  _id: string
  name: string
  department: string
}

export default function ProfessorDeleteForm() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professors`)
      .then((res) => res.json())
      .then((data) => setProfessors(data.professors || []))
      .catch(() => setProfessors([]))
  }, [])

  async function handleDelete() {
    if (!selectedId) {
      setMessage('삭제할 교수를 선택하세요.')
      return
    }

    if (!confirm('정말 삭제하시겠습니까?')) return

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/professors?id=${selectedId}`,
      {
        method: 'DELETE',
      }
    )

    if (res.ok) {
      setMessage('삭제 성공')
      setProfessors(professors.filter((prof) => prof._id !== selectedId))
      setSelectedId('')
    } else {
      setMessage('삭제 실패. 다시 시도해주세요.')
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">교수 삭제</h3>
      <select
        className="block w-full rounded-md border border-gray-200 px-3 py-2 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">-- 선택하세요 --</option>
        {professors.map((prof) => (
          <option key={prof._id} value={prof._id}>
            {prof.name}: {prof.department} ({prof._id})
          </option>
        ))}
      </select>

      <div className="flex items-center gap-3">
        <button
          onClick={handleDelete}
          disabled={!selectedId}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          삭제
        </button>
        {message && <p className="text-sm text-gray-500">{message}</p>}
      </div>
    </div>
  )
}
