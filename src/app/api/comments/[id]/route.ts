import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'
import { requireAuth } from '@/libs/auth'

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const userId = await requireAuth()
    const { id } = context.params
    const { content, contentRate, homeworkRate, examRate } = await req.json()

    await connectMongoDB()

    const comment = await Comment.findById(id)
    if (!comment) {
      return NextResponse.json(
        { ok: false, error: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (comment.user !== userId) {
      return NextResponse.json(
        { ok: false, error: '권한이 없습니다.' },
        { status: 403 }
      )
    }

    comment.content = content
    comment.contentRate = Number(contentRate ?? comment.contentRate)
    comment.homeworkRate = Number(homeworkRate ?? comment.homeworkRate)
    comment.examRate = Number(examRate ?? comment.examRate)

    await comment.save()

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('댓글 수정 오류:', e)
    return NextResponse.json(
      { ok: false, error: '서버 내부 오류' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const userId = await requireAuth()
    const { id } = context.params

    await connectMongoDB()

    const comment = await Comment.findById(id)
    if (!comment) {
      return NextResponse.json(
        { ok: false, error: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (comment.user !== userId) {
      return NextResponse.json(
        { ok: false, error: '권한이 없습니다.' },
        { status: 403 }
      )
    }

    await Comment.findByIdAndDelete(id)

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('댓글 삭제 오류:', e)
    return NextResponse.json(
      { ok: false, error: '서버 내부 오류' },
      { status: 500 }
    )
  }
}
