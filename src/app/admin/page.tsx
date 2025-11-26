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
      <div>
        <h2>접근 권한이 없습니다.</h2>
        <p>관리자만 접근할 수 있는 페이지입니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <h1>관리자 페이지</h1>
      <Link href="/">→홈 화면 이동</Link>
      <Link href="/admin/register">→교수, 강의 등록 페이지 이동</Link>
      <Link href="/admin/delete">→교수, 강의 삭제 페이지 이동</Link>
    </div>
  )
}
