import { NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const courseId = url.searchParams.get('courseId')
    const sort = url.searchParams.get('sort') || 'latest' // latest | like
    const page = Number(url.searchParams.get('page') || 1)
    const pageSize = 5

    if (!courseId) {
      return NextResponse.json(
        { ok: false, error: 'courseId 필요' },
        { status: 400 }
      )
    }

    await connectMongoDB()

    const sortOption =
      sort === 'like' ? { likes: -1, createdAt: -1 } : { createdAt: -1 }

    const comments = await Comment.find({ course: courseId })
      .sort(sortOption as any)
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    const totalCount = await Comment.countDocuments({ course: courseId })

    return NextResponse.json({
      ok: true,
      comments,
      hasMore: page * pageSize < totalCount,
    })
  } catch (e: any) {
    console.error('댓글 목록 조회 오류:', e)
    return NextResponse.json(
      { ok: false, error: '서버 내부 오류' },
      { status: 500 }
    )
  }
}
