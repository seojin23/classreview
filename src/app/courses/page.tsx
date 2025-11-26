import React from 'react'
import Link from 'next/link'
import CoursesList from '@/components/CoursesList'

export default function coursesPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <p>강의 목록 화면</p>
      <Link href="/">→홈 화면 이동</Link>
      <br />
      <CoursesList />
    </div>
  )
}
