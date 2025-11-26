import { Metadata } from 'next'
import React from 'react'
import Link from 'next/link' // Link 임포트

interface Course {
  _id: string
  title: string
  code: string
  credits: number
  professor: {
    _id: string // 교수 ID도 받아야 링크 가능
    name: string
  }
}

interface Props {
  params: Promise<{ id: string }>
}

async function getCourse(id: string): Promise<Course | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const course = await getCourse(id)
  return {
    title: course ? `${course.title} 강의 상세` : '강의 상세 정보 없음',
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params

  const course = await getCourse(id)

  if (!course) return <p>존재하지 않는 강의입니다.</p>

  return (
    <div>
      <h1>{course.title}</h1>
      <p>코드: {course.code}</p>
      <p>학점: {course.credits}</p>
      <div>
        담당 교수:{' '}
        {course.professor ? (
          <Link href={`/professors/${course.professor._id}`}>
            <p>{course.professor.name}</p>
          </Link>
        ) : (
          '정보 없음'
        )}
      </div>
    </div>
  )
}
