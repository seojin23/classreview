'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import CommentEditor from '@/components/comments/CommentEditor'
import CommentItem from '@/components/comments/CommentItem'

interface Comment {
  _id: string
  user: string
  course: string
  content: string
  contentRate: number
  homeworkRate: number
  examRate: number
  likes: number
  likedUsers: string[]
  createdAt: string
  updatedAt: string
}

interface Stats {
  avgContent: number
  avgHomework: number
  avgExam: number
  total: number
}

export default function CourseDetailClient({ courseId }: { courseId: string }) {
  const { user } = useUser()

  const [comments, setComments] = useState<Comment[]>([])
  const [sort, setSort] = useState<'latest' | 'like'>('latest')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [stats, setStats] = useState<Stats>({
    avgContent: 0,
    avgHomework: 0,
    avgExam: 0,
    total: 0,
  })

  // 평균 별점
  async function fetchStats() {
    try {
      const res = await fetch(`/api/comments?courseId=${courseId}`)
      if (!res.ok) return
      const data = await res.json()
      if (data.ok) {
        setStats({
          avgContent: data.avgContent,
          avgHomework: data.avgHomework,
          avgExam: data.avgExam,
          total: data.total,
        })
      }
    } catch (e) {
      console.error('fetchStats 실패:', e)
    }
  }

  // 댓글 목록
  async function fetchComments(options?: {
    reset?: boolean
    pageParam?: number
  }) {
    const reset = options?.reset ?? false
    const targetPage = options?.pageParam ?? (reset ? 1 : page)

    try {
      const res = await fetch(
        `/api/comments/query?courseId=${courseId}&sort=${sort}&page=${targetPage}`
      )
      if (!res.ok) return
      const data = await res.json()
      if (!data.ok) return

      if (reset) {
        setComments(data.comments)
        setHasMore(data.hasMore)
        setPage(1)
      } else {
        setComments((prev) => {
          const map = new Map<string, Comment>()
          prev.forEach((c) => map.set(c._id, c))
          ;(data.comments as Comment[]).forEach((c) => map.set(c._id, c))
          return Array.from(map.values())
        })
        setHasMore(data.hasMore)
        setPage(targetPage)
      }
    } catch (e) {
      console.error('fetchComments 실패:', e)
    }
  }

  // 초기 및 정렬 변경 시
  useEffect(() => {
    fetchStats()
    fetchComments({ reset: true })
  }, [sort, courseId])

  // 새 댓글 작성
  async function handleCreate(payload: {
    content: string
    contentRate: number
    homeworkRate: number
    examRate: number
  }) {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId,
        ...payload,
      }),
    })

    if (!res.ok) return
    const data = await res.json()
    if (!data.ok) return

    await fetchStats()
    await fetchComments({ reset: true })
  }

  // 좋아요
  async function handleLike(commentId: string) {
    const res = await fetch('/api/comments/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId }),
    })

    if (!res.ok) return
    const data = await res.json()
    if (!data.ok) return

    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? { ...c, likes: data.likes } : c))
    )
  }

  // 수정
  async function handleEdit(
    id: string,
    fields: {
      content: string
      contentRate: number
      homeworkRate: number
      examRate: number
    }
  ) {
    const res = await fetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    })

    if (!res.ok) return
    const data = await res.json()
    if (!data.ok) return

    await fetchStats()
    await fetchComments({ reset: true })
  }

  // 삭제
  async function handleDelete(id: string) {
    if (!confirm('정말 삭제하시겠습니까?')) return

    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
    if (!res.ok) return
    const data = await res.json()
    if (!data.ok) return

    await fetchStats()
    await fetchComments({ reset: true })
  }

  // ⭐ 종합평점 계산
  const overall =
    stats.total > 0
      ? (stats.avgContent + stats.avgHomework + stats.avgExam) / 3
      : 0

  return (
    <div className="mt-10">
      {/* ⭐ NEW 평균 별점 박스 */}
      <div className="mb-6 p-5 border rounded bg-gray-50">
        {/* 종합 평점 크게 */}
        <p className="text-xl font-bold flex items-center gap-2">
          ⭐ 종합 평점 {overall.toFixed(1)} / 5.0
          <span className="text-xs text-gray-500">({stats.total}명 참여)</span>
        </p>

        {/* 세부 평균 – 작게 */}
        <div className="mt-2 text-xs text-gray-600 space-y-1">
          <p>내용: {stats.avgContent.toFixed(1)} / 5.0</p>
          <p>숙제: {stats.avgHomework.toFixed(1)} / 5.0</p>
          <p>시험: {stats.avgExam.toFixed(1)} / 5.0</p>
        </div>
      </div>

      {/* 댓글 작성 */}
      <CommentEditor onSubmit={handleCreate} />

      {/* 정렬 */}
      <div className="flex gap-4 mb-4">
        <button
          className={sort === 'latest' ? 'font-bold' : ''}
          onClick={() => setSort('latest')}
        >
          최신순
        </button>
        <button
          className={sort === 'like' ? 'font-bold' : ''}
          onClick={() => setSort('like')}
        >
          추천순
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map((c) => (
          <CommentItem
            key={c._id}
            comment={c}
            currentUserId={user?.id ?? null}
            onLike={() => handleLike(c._id)}
            onEdit={(fields) => handleEdit(c._id, fields)}
            onDelete={() => handleDelete(c._id)}
          />
        ))}
      </div>

      {/* 더보기 */}
      {hasMore && (
        <button
          className="mt-4 w-full border p-2 rounded"
          onClick={() => fetchComments({ reset: false, pageParam: page + 1 })}
        >
          더보기
        </button>
      )}
    </div>
  )
}
