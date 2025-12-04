import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'
import { requireAuth } from '@/libs/auth'

// 댓글 작성
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth()

    const { courseId, content, contentRate, homeworkRate, examRate } =
      await req.json()

    if (!courseId || !content) {
      return NextResponse.json(
        { ok: false, error: 'courseId와 content는 필수입니다.' },
        { status: 400 }
      )
    }

    await connectMongoDB()

    await Comment.create({
      user: userId,
      course: courseId,
      content,
      contentRate: Number(contentRate ?? 0),
      homeworkRate: Number(homeworkRate ?? 0),
      examRate: Number(examRate ?? 0),
      likes: 0,
      likedUsers: [],
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('댓글 작성 오류:', e)
    return NextResponse.json(
      { ok: false, error: '서버 내부 오류' },
      { status: 500 }
    )
  }
}

// 평균 별점 조회
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const courseId = url.searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json(
        { ok: false, error: 'courseId 필요' },
        { status: 400 }
      )
    }

    await connectMongoDB()

    const comments = await Comment.find({ course: courseId })

    if (comments.length === 0) {
      return NextResponse.json({
        ok: true,
        avgContent: 0,
        avgHomework: 0,
        avgExam: 0,
        total: 0,
      })
    }

    const total = comments.length
    const avgContent =
      comments.reduce((a, c) => a + Number(c.contentRate || 0), 0) / total
    const avgHomework =
      comments.reduce((a, c) => a + Number(c.homeworkRate || 0), 0) / total
    const avgExam =
      comments.reduce((a, c) => a + Number(c.examRate || 0), 0) / total

    return NextResponse.json({
      ok: true,
      avgContent,
      avgHomework,
      avgExam,
      total,
    })
  } catch (e: any) {
    console.error('평균 별점 조회 오류:', e)
    return NextResponse.json(
      { ok: false, error: '서버 내부 오류' },
      { status: 500 }
    )
  }
}
