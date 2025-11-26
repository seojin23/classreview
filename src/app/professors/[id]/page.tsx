import { Metadata } from 'next'
import React from 'react'

interface Professor {
  _id: string
  name: string
  department: string
  email: string
}

interface Props {
  params: Promise<{ id: string }>
}

async function getProfessor(id: string): Promise<Professor | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/professors/${id}`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const professor = await getProfessor(id)
  return {
    title: professor ? `${professor.name} 교수 상세` : '교수 상세 정보 없음',
  }
}

export default async function ProfessorDetailPage({ params }: Props) {
  const { id } = await params

  const professor = await getProfessor(id)

  if (!professor) {
    return <p>존재하지 않는 교수입니다.</p>
  }

  return (
    <div>
      <h1>{professor.name} 교수 상세정보</h1>
      <p>학과: {professor.department}</p>
      <p>이메일: {professor.email}</p>
      {/* 필요시 담당 강의 리스트 컴포넌트 삽입 */}
    </div>
  )
}
