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
    <div>
      <h3>교수 삭제</h3>
      <select
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
      <button onClick={handleDelete} disabled={!selectedId}>
        삭제
      </button>
      {message && <p>{message}</p>}
    </div>
  )
}
