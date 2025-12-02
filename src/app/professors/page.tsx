'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface Professor {
  _id: string
  name: string
  department: string
  email: string
}

export default function ProfessorsList() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // API 호출 (환경변수 또는 상대경로 사용)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${apiUrl}/api/professors`)
      .then((res) => {
        if (!res.ok) throw new Error('데이터 조회 실패')
        return res.json()
      })
      .then((data) => {
        // API 응답 구조에 따라 data.professors 또는 data로 처리
        setProfessors(data.professors || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // 로딩 상태 디자인
  if (loading) return (
    <div className="flex justify-center items-center py-20 w-full">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
  )
  
  // 에러 상태 디자인
  if (error) return (
    <div className="w-full p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
      ⚠️ 오류가 발생했습니다: {error}
    </div>
  )

  // 데이터가 없을 경우
  if (professors.length === 0) return (
    <div className="w-full py-10 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
      등록된 교수님 정보가 없습니다.
    </div>
  )

  // 메인 리스트 (카드 그리드형)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {professors.map((prof) => (
        <Link 
          key={prof._id} 
          href={`/professors/${prof._id}`}
          className="group block h-full"
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 p-6 flex flex-col items-center text-center h-full relative overflow-hidden">
            
            {/* 장식용 배경 (선택사항) */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* 아바타 (이름 첫 글자) */}
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <span className="text-3xl font-bold text-indigo-600">
                {prof.name.charAt(0)}
              </span>
            </div>

            {/* 교수님 정보 */}
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
              {prof.name} <span className="text-sm font-normal text-gray-500">교수님</span>
            </h3>
            
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-4 border border-gray-200">
              {prof.department}
            </span>

            {/* 이메일 등 추가 정보 */}
            <p className="text-sm text-gray-400 mt-auto break-all px-2">
              {prof.email}
            </p>
            
            {/* 액션 버튼 (호버 시 강조) */}
            <div className="mt-5 w-full py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              상세 정보 보기
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
