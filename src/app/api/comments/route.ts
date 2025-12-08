// src/app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'
import mongoose from 'mongoose'

/**
 * 댓글 작성 (POST)
 * body: { courseId, content, contentRate, homeworkRate, examRate, userId }
 */
export async function POST(req: NextRequest) {
  try {
    await connectMongoDB()
    const { courseId, content, contentRate, homeworkRate, examRate, userId } =
      await req.json()

    if (!courseId || !content) {
      return NextResponse.json(
        { ok: false, error: 'courseId와 content 필요' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: 'userId 필요' },
        { status: 400 }
      )
    }

    const courseObjId = new mongoose.Types.ObjectId(courseId)

    const newComment = await Comment.create({
      user: userId,
      course: courseObjId,
      content,
      contentRate,
      homeworkRate,
      examRate,
      likes: [],
    })

    return NextResponse.json({ ok: true, comment: newComment })
  } catch (e) {
    console.error('댓글 작성 오류:', e)
    return NextResponse.json({ ok: false, error: '댓글 작성 실패' })
  }
}

/**
 * 댓글 통계 (GET)
 * query: ?courseId=...
 */
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB()

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ ok: false, error: 'courseId 필요' })
    }

    const courseObjId = new mongoose.Types.ObjectId(courseId)

    const comments = await Comment.find({ course: courseObjId })

    if (!comments.length) {
      return NextResponse.json({
        ok: true,
        data: {
          stats: {
            avgContent: 0,
            avgHomework: 0,
            avgExam: 0,
            avgAll: 0,
            total: 0,
          },
        },
      })
    }

    const sumContent = comments.reduce((a, c) => a + c.contentRate, 0)
    const sumHomework = comments.reduce((a, c) => a + c.homeworkRate, 0)
    const sumExam = comments.reduce((a, c) => a + c.examRate, 0)

    const total = comments.length

    const stats = {
      avgContent: sumContent / total,
      avgHomework: sumHomework / total,
      avgExam: sumExam / total,
      avgAll: (sumContent + sumHomework + sumExam) / (total * 3),
      total,
    }

    return NextResponse.json({ ok: true, data: { stats } })
  } catch (e) {
    console.error('댓글 통계 오류:', e)
    return NextResponse.json({ ok: false })
  }
}
