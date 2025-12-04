'use client'

import { useState, useEffect } from 'react'

interface Course {
  _id: string
  title: string
  code: string
}

export default function CourseDeleteForm() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data.courses || []))
      .catch(() => setCourses([]))
  }, [])

  async function handleDelete() {
    if (!selectedId) {
      setMessage('삭제할 강의를 선택하세요.')
      return
    }

    if (!confirm('정말 삭제하시겠습니까?')) return

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses?id=${selectedId}`,
      {
        method: 'DELETE',
      }
    )

    if (res.ok) {
      setMessage('삭제 성공')
      setCourses(courses.filter((course) => course._id !== selectedId))
      setSelectedId('')
    } else {
      setMessage('삭제 실패. 다시 시도해주세요.')
    }
  }

  return (
    <div>
      <h3>강의 삭제</h3>
      <select value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">-- 선택하세요 --</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.title}: {course.code} ({course._id})
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
