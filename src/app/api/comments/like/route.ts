import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'
import { requireAuth } from '@/libs/auth'

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth()
    const { commentId } = await req.json()

    await connectMongoDB()

    const comment = await Comment.findById(commentId)
    if (!comment) {
      return NextResponse.json(
        { ok: false, error: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const isLiked = comment.likedUsers.includes(userId)

    if (isLiked) {
      comment.likedUsers = comment.likedUsers.filter(
        (id: string) => id !== userId
      )
      comment.likes -= 1
    } else {
      comment.likedUsers.push(userId)
      comment.likes += 1
    }

    await comment.save()

    return NextResponse.json({
      ok: true,
      likes: comment.likes,
      liked: !isLiked,
    })
  } catch (e: any) {
    console.error('좋아요 토글 오류:', e)
    return NextResponse.json(
      { ok: false, error: '서버 내부 오류' },
      { status: 500 }
    )
  }
}
