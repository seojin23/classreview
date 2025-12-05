// src/app/api/comments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'

type ParamsPromise = Promise<{ id: string }>

export async function PATCH(
  req: NextRequest,
  context: { params: ParamsPromise }
) {
  try {
    await connectMongoDB()

    const { id } = await context.params
    const { content, contentRate, homeworkRate, examRate } = await req.json()

    const updated = await Comment.findByIdAndUpdate(
      id,
      {
        content,
        contentRate,
        homeworkRate,
        examRate,
        updatedAt: new Date(),
      },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json(
        { ok: false, error: '댓글 없음' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, comment: updated })
  } catch (e) {
    console.error('댓글 수정 오류:', e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: ParamsPromise }
) {
  try {
    await connectMongoDB()
    const { id } = await context.params

    const deleted = await Comment.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: '댓글 없음' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('댓글 삭제 오류:', e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
