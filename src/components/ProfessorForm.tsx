'use client'

import { useState } from 'react'

export default function ProfessorForm() {
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/professors`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, department, email }),
      }
    )

    if (res.ok) {
      setMessage('교수가 성공적으로 추가되었습니다. 1초후 새로고침...')
      setName('')
      setDepartment('')
      setEmail('')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      setMessage('오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        이름:
        <br />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        학과:
        <br />
        <input
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        이메일:
        <br />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
      </label>
      <br />
      <button type="submit">→추가</button>
      <p>{message}</p>
    </form>
  )
}
