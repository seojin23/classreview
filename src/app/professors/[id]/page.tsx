import { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import connectMongoDB from '@/libs/mongodb'
import Course from '@/models/course'

interface Professor {
  _id: string
  name: string
  department: string
  email: string
}

interface Course {
  _id: string
  title: string
  code: string
  credits: number
}

interface Props {
  params: Promise<{ id: string }>
}

// 교수 정보 가져오기 (기존 API 방식 유지)
async function getProfessor(id: string): Promise<Professor | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/professors/${id}`,
      {
        cache: 'no-store',
      }
    )
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching professor:', error)
    return null
  }
}

// 교수 담당 강의 목록 가져오기 (DB 직접 조회 방식 추가)
async function getProfessorCourses(professorId: string): Promise<Course[]> {
  try {
    await connectMongoDB()
    // 해당 교수 ID를 가진 강의들을 찾아서 최신순(생성 역순)으로 정렬
    const courses = await Course.find({ professor: professorId })
      .select('_id title code credits') // 필요한 필드만 선택
      .sort({ createdAt: -1 })
      .lean()

    // MongoDB 문서를 일반 객체로 변환 (ID 직렬화)
    return courses.map((course: any) => ({
      ...course,
      _id: course._id.toString(),
    }))
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const professor = await getProfessor(id)
  return {
    title: professor ? `${professor.name} 교수님 상세` : '교수 상세 정보 없음',
  }
}

export default async function ProfessorDetailPage({ params }: Props) {
  const { id } = await params
  
  // 교수 정보와 강의 목록을 병렬로 가져옴 (성능 최적화)
  const [professor, courses] = await Promise.all([
    getProfessor(id),
    getProfessorCourses(id)
  ])

  if (!professor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600 mb-4">존재하지 않는 교수님입니다.</p>
        <Link 
          href="/professors" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* 상단 네비게이션 */}
        <div className="mb-8">
          <Link 
            href="/professors"
            className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors font-medium"
          >
            <span className="mr-2">←</span> 교수님 목록으로 돌아가기
          </Link>
        </div>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* 상단 배경 장식 */}
          <div className="h-32 bg-indigo-600/10 w-full"></div>

          <div className="px-8 pb-8">
            {/* 프로필 헤더 영역 */}
            <div className="relative flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6">
              
              {/* 아바타 */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full p-1.5 shadow-md">
                <div className="w-full h-full bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 text-4xl sm:text-5xl font-bold border border-indigo-100">
                  {professor.name.charAt(0)}
                </div>
              </div>

              {/* 이름 및 학과 정보 */}
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {professor.name} <span className="text-lg text-gray-500 font-normal">교수님</span>
                </h1>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                    {professor.department}
                  </span>
                </div>
              </div>
            </div>

            {/* 상세 정보 섹션 */}
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">상세 정보</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                    📧
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">이메일</p>
                    <p className="text-base font-medium text-gray-900 mt-1 break-all">{professor.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 담당 강의 목록 섹션 (기능 추가됨) */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  담당 강의 <span className="ml-1 text-indigo-600">{courses.length}</span>
                </h3>
              </div>

              {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <Link 
                      key={course._id} 
                      href={`/courses/${course._id}`}
                      className="block group"
                    >
                      <div className="p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                              {course.code}
                            </span>
                            <span className="text-xs text-gray-500">
                              {course.credits}학점
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2">
                            {course.title}
                          </h4>
                        </div>
                        <div className="mt-3 text-sm text-gray-400 group-hover:text-indigo-500 flex items-center font-medium">
                          강의평 보러가기 →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500">아직 등록된 담당 강의가 없습니다.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
