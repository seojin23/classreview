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
    <form onSubmit={handleSubmit}>
      <label>
        강의명:
        <br />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        코드:
        <br />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        학점:
        <br />
        <input
          type="number"
          min={1}
          max={10}
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value))}
          required
        />
      </label>
      <br />
      <label>
        담당 교수:
        <br />
        <select
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
      </label>
      <br />
      <button type="submit">→추가</button>
      <p>{message}</p>
    </form>
  )
}
