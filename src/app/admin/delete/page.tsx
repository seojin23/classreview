import { auth } from '@clerk/nextjs/server'
import { adminIds } from '@/libs/auth'
import Link from 'next/link'
import ProfessorDeleteForm from '@/components/ProfessorDeleteForm'
import CourseDeleteForm from '@/components/CourseDeleteForm'

export default async function adminDeletePage() {
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
      <div>
        <h2>접근 권한이 없습니다.</h2>
        <p>관리자만 접근할 수 있는 페이지입니다.</p>
      </div>
    )
  }
  return (
    <div>
      <h1>관리자: 삭제 페이지</h1>
      <Link href="/admin">→관리자 홈 화면 이동</Link>
      <div className="border-black border-2">
        <ProfessorDeleteForm />
      </div>
      <div className="border-black border-2">
        <CourseDeleteForm />
      </div>
    </div>
  )
}
