import { auth } from '@clerk/nextjs/server'
import { adminIds } from '@/libs/auth'
import ProfessorForm from '@/components/ProfessorForm'
import CourseForm from '@/components/CourseForm'
import Link from 'next/link'

export default async function adminPage() {
  const { userId } = await auth()

  if (!userId) {
    return (
      <div>
        <h2>로그인이 필요합니다.</h2>
        <p>접근 권한이 없습니다. 로그인 후 다시 시도해주세요.</p>
      </div>
    )
  }

  if (!adminIds.includes(userId)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            접근 권한이 없습니다.
          </h2>
          <p className="text-sm text-gray-500">
            관리자만 접근할 수 있는 페이지입니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                관리자 페이지
              </h1>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              관리 작업을 선택하세요.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/admin/register"
                className="block text-center px-4 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                등록 페이지로 이동
              </Link>

              <Link
                href="/admin/delete"
                className="block text-center px-4 py-4 bg-white text-gray-800 rounded-lg border border-gray-200 hover:shadow-md transition-all"
              >
                삭제 페이지로 이동
              </Link>
            </div>

            <div className="mt-6">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                ← 홈 화면으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
