// src/app/api/comments/like/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'
import { getAuth } from '@clerk/nextjs/server'

interface LikeRequestBody {
  commentId: string
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB()

    const body = (await req.json()) as LikeRequestBody
    const commentId = body.commentId

    const { userId } = getAuth(req)
    const uid: string | null = userId ?? null

    if (!uid) {
      return NextResponse.json({ ok: false, error: '로그인이 필요합니다.' })
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
      return NextResponse.json({ ok: false, error: '댓글 없음' })
    }

    const hasLiked = comment.likes.includes(uid)

    if (hasLiked) {
      // 좋아요 취소
      comment.likes = comment.likes.filter((id: string) => id !== uid)
    } else {
      // 좋아요 추가
      comment.likes.push(uid)
    }

    await comment.save()

    return NextResponse.json({
      ok: true,
      likes: comment.likes.length,
    })
  } catch (e) {
    console.error('좋아요 토글 오류:', e)
    return NextResponse.json({ ok: false, error: '서버 오류' })
  }
}
