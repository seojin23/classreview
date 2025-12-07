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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">이름</label>
        <input
          className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">학과</label>
        <input
          className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
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
