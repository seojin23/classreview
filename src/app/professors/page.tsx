import React from 'react'
import Link from 'next/link'
import ProfessorsList from '@/components/ProfessorsList'

export default function professorsPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <p>교수 목록 화면</p>
      <Link href="/">→홈 화면 이동</Link>
      <br />
      <ProfessorsList />
    </div>
  )
}
