import { auth } from '@clerk/nextjs/server'
import { adminIds } from '@/libs/auth'
import ProfessorForm from '@/components/ProfessorForm'
import CourseForm from '@/components/CourseForm'
import Link from 'next/link'

export default async function adminRegisterPage() {
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
          >
            ← 관리자 홈으로
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              교수 추가
            </h2>
            <div>
              <ProfessorForm />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              강의 추가
            </h2>
            <div>
              <CourseForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
