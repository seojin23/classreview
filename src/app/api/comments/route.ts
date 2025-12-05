// src/app/api/comments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'
import { auth } from '@clerk/nextjs/server'

// Clerk에서 userId 가져오는 헬퍼
async function getUserIdOrThrow() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('UNAUTHORIZED')
  }
  return userId
}

// 🔧 댓글 수정 (PATCH /api/comments/[id])
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ⬅ params가 Promise라서 이렇게 타입 지정
) {
  try {
    const { id } = await context.params // ⬅ 여기서 await로 풀어줌
    const userId = await getUserIdOrThrow()
    const { content, contentRate, homeworkRate, examRate } = await req.json()

    await connectMongoDB()

    const comment = await Comment.findById(id)
    if (!comment) {
      return NextResponse.json(
        { ok: false, error: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    if (comment.user !== userId) {
      return NextResponse.json(
        { ok: false, error: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    comment.content = content
    comment.contentRate = contentRate
    comment.homeworkRate = homeworkRate
    comment.examRate = examRate
    await comment.save()

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { ok: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    console.error('PATCH /api/comments/[id] 오류:', e)
    return NextResponse.json({ ok: false, error: '서버 오류' }, { status: 500 })
  }
}

// 🔧 댓글 삭제 (DELETE /api/comments/[id])
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ⬅ 여기도 동일하게 Promise 타입
) {
  try {
    const { id } = await context.params // ⬅ await 필수
    const userId = await getUserIdOrThrow()

    await connectMongoDB()

    const comment = await Comment.findById(id)
    if (!comment) {
      return NextResponse.json(
        { ok: false, error: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    if (comment.user !== userId) {
      return NextResponse.json(
        { ok: false, error: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    await Comment.findByIdAndDelete(id)

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { ok: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    console.error('DELETE /api/comments/[id] 오류:', e)
    return NextResponse.json({ ok: false, error: '서버 오류' }, { status: 500 })
  }
}
