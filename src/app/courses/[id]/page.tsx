// src/app/courses/[id]/page.tsx
import './course-detail.css'
import { Metadata } from 'next'
import Link from 'next/link'
import CourseDetailClient from './CourseDetailClient'

interface Course {
  _id: string
  title: string
  code: string
  credits: number
  professor: {
    _id: string
    name: string
  } | null
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
    <div className="detail-container">
      {/* 제목 */}
      <h1 className="detail-title">{course.title}</h1>

      {/* ← 강의 목록으로 돌아가기 (제목 밑, 카드 위) */}
      <div className="back-wrapper">
        <Link href="/courses" className="back-link">
          ← 강의 목록으로 돌아가기
        </Link>
      </div>

      {/* 강의 기본 정보 카드 */}
      <div className="info-card">
        <div className="info-row">
          <span className="info-label">강의 코드</span>
          <span className="info-value">{course.code}</span>
        </div>

        <div className="info-row">
          <span className="info-label">학점</span>
          <span className="info-value">{course.credits}학점</span>
        </div>

        <div className="info-row">
          <span className="info-label">담당 교수</span>
          {course.professor ? (
            <Link
              href={`/professors/${course.professor._id}`}
              className="info-prof-link"
            >
              {course.professor.name}
            </Link>
          ) : (
            <span className="info-value">정보 없음</span>
          )}
        </div>
      </div>

      {/* 평점 통계 + 댓글 영역 (아래 컴포넌트에서 디자인) */}
      <CourseDetailClient course={course} />
    </div>
  )
}
