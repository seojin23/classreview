// src/app/me/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import connectMongoDB from '@/libs/mongodb'
import Evaluation, { IEvaluation } from '@/models/evaluation'
// src/app/me/page.tsx
import MyScheduleClient from './MyScheduleClient'

// populate된 course까지 포함해서 사용할 타입
type MyEvaluation = Omit<IEvaluation, 'course'> & {
  course?: {
    _id: string
    title: string
    code: string
  }
}

export default async function MePage() {
  const { userId } = await auth()

  if (!userId) {
    return (
      <div className="flex flex-col items-center mt-10">
        <p>로그인이 필요합니다.</p>
        <Link href="/" className="mt-2 underline text-sm">
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  const user = await currentUser()
  await connectMongoDB()

  const evaluations = (await Evaluation.find({ authorId: userId })
    .populate('course')
    .sort({ createdAt: -1 })
    .lean()) as unknown as MyEvaluation[]

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      {/* 내 정보 */}
      <section className="border p-4 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">내 페이지</h1>
        <h2 className="text-lg font-semibold mb-2">내 정보</h2>
        <p>이름: {user?.fullName ?? user?.firstName ?? '이름 없음'}</p>
        <p>이메일: {user?.emailAddresses?.[0]?.emailAddress}</p>
        <p className="text-sm text-gray-500">userId: {user?.id}</p>
      </section>

      {/* 내 시간표 자리 */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">내 시간표</h2>
        <MyScheduleClient />
      </section>

      {/* 내가 작성한 평가 */}
      <section className="border p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">내가 작성한 강의 평가</h2>
        {evaluations.length === 0 ? (
          <p>아직 작성한 강의 평가가 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {evaluations.map((ev) => (
              <li key={ev._id.toString()} className="border rounded p-3">
                <div className="font-medium">
                  {ev.course ? (
                    <Link
                      href={`/courses/${ev.course._id.toString()}`}
                      className="underline"
                    >
                      {ev.course.title} ({ev.course.code})
                    </Link>
                  ) : (
                    '강의 정보 없음'
                  )}
                </div>
                <div>⭐ {ev.rating}</div>
                {ev.comment && (
                  <div className="text-sm text-gray-700 mt-1">{ev.comment}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 🔥 여기 추가된 홈 버튼 */}
      <div className="flex justify-center mt-8">
        <Link
          href="/"
          className="px-4 py-2 bg-[#6c47ff] text-white rounded-md text-sm font-medium hover:bg-[#5a3edb]"
        >
          홈 화면으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
