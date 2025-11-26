'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface Professor {
  _id: string
  name: string
  department: string
  email: string
}

export default function ProfessorsList() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professors`)
      .then((res) => {
        if (!res.ok) throw new Error('데이터 조회 실패')
        return res.json()
      })
      .then((data) => {
        setProfessors(data.professors || [])
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
      {professors.map((prof) => (
        <li key={prof._id}>
          <Link href={`/professors/${prof._id}`}>
            <p>
              <strong>{prof.name}</strong> - {prof.department} - {prof.email}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
