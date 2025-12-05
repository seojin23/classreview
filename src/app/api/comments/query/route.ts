// src/app/api/comments/query/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'
import mongoose from 'mongoose'

type SortObject = Record<string, 1 | -1>

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB()

    const { searchParams } = new URL(req.url)

    const courseId = searchParams.get('courseId')
    const sort = searchParams.get('sort') ?? 'latest'
    const page = Number(searchParams.get('page') ?? 1)
    const PAGE_SIZE = 5

    if (!courseId) {
      return NextResponse.json(
        { ok: false, error: 'courseId 필요' },
        { status: 400 }
      )
    }

    const courseObjId = new mongoose.Types.ObjectId(courseId)

    const sortStage: SortObject =
      sort === 'like' ? { likesCount: -1, createdAt: -1 } : { createdAt: -1 }

    const results = await Comment.aggregate([
      { $match: { course: courseObjId } },

      // likesCount 계산
      { $addFields: { likesCount: { $size: '$likes' } } },

      { $sort: sortStage },
      { $skip: (page - 1) * PAGE_SIZE },
      { $limit: PAGE_SIZE },
    ])

    const totalCount = await Comment.countDocuments({ course: courseObjId })
    const hasMore = page * PAGE_SIZE < totalCount

    return NextResponse.json({
      ok: true,
      comments: results,
      hasMore,
    })
  } catch (e) {
    console.error('댓글 페이지네이션 오류:', e)
    return NextResponse.json({ ok: false, error: '서버 오류' }, { status: 500 })
  }
}
