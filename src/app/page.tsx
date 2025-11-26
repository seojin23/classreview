import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <p>홈 화면</p>
      <Link href="/professors">→교수 목록 이동</Link>
      <Link href="/courses">→강의 목록 이동</Link>
      <Link href="/admin">→관리자 페이지 이동</Link>
    </div>
  )
}
