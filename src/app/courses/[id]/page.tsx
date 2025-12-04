import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import CourseDetailClient from './CourseDetailClient'

interface Course {
  _id: string
  title: string
  code: string
  credits: number
  professor: {
    _id: string
    name: string
  }
}

interface Props {
  params: Promise<{ id: string }>
}

async function getCourse(id: string): Promise<Course | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`,
    { cache: 'no-store' }
  )
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const course = await getCourse(id)
  return {
    title: course ? `${course.title} - 강의 상세` : '강의 정보 없음',
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params
  const course = await getCourse(id)

  if (!course) return <p className="p-4">존재하지 않는 강의입니다.</p>

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{course.title}</h1>

      <div className="border rounded-lg shadow-sm divide-y">
        <div className="p-4 flex justify-between">
          <span className="font-semibold text-gray-700">강의 코드</span>
          <span className="text-gray-800">{course.code}</span>
        </div>

        <div className="p-4 flex justify-between">
          <span className="font-semibold text-gray-700">학점</span>
          <span className="text-gray-800">{course.credits}학점</span>
        </div>

        <div className="p-4 flex justify-between">
          <span className="font-semibold text-gray-700">담당 교수</span>
          {course.professor ? (
            <Link
              href={`/professors/${course.professor._id}`}
              className="text-blue-600 hover:underline"
            >
              {course.professor.name}
            </Link>
          ) : (
            <span className="text-gray-500">정보 없음</span>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link href="/courses" className="text-blue-600 hover:underline">
          ← 강의 목록으로 돌아가기
        </Link>
      </div>

      {/* ⬇ 댓글 UI 추가 (Client Component) */}
      <div className="mt-12">
        <CourseDetailClient courseId={id} />
      </div>
    </div>
  )
}
