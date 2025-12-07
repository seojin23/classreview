// src/app/courses/[id]/hooks/useComments.ts
'use client'

import { useCallback, useEffect, useState } from 'react'

export interface CommentStats {
  avgContent: number
  avgHomework: number
  avgExam: number
  avgAll: number
  total: number
}

export interface CommentItem {
  _id: string
  user: string
  course: string
  content: string
  contentRate: number
  homeworkRate: number
  examRate: number
  likes: number // UI에서는 숫자
  createdAt: string
  updatedAt: string
}

export function useComments(courseId: string) {
  const [comments, setComments] = useState<CommentItem[]>([])
  const [stats, setStats] = useState<CommentStats>({
    avgContent: 0,
    avgHomework: 0,
    avgExam: 0,
    avgAll: 0,
    total: 0,
  })

  const [sort, setSort] = useState<'latest' | 'like'>('latest')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 통계만 따로
  const refreshStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?courseId=${courseId}`, {
        cache: 'no-store',
      })
      if (!res.ok) return
      const json = await res.json()
      if (!json.ok) return

      const apiStats = json.data.stats as CommentStats
      setStats(apiStats)
    } catch (e) {
      console.error('refreshStats 실패:', e)
    }
  }, [courseId])

  // 댓글 목록 + 페이지네이션
  const fetchComments = useCallback(
    async (options?: { reset?: boolean; pageParam?: number }) => {
      const reset = options?.reset ?? false
      const targetPage = options?.pageParam ?? page

      try {
        if (reset) setLoading(true)
        else setLoadingMore(true)

        setError(null)

        const res = await fetch(
          `/api/comments/query?courseId=${courseId}&sort=${sort}&page=${targetPage}`,
          { cache: 'no-store' }
        )

        const data = await res.json()
        if (!data.ok) return

        const newCommentsRaw = data.comments || []
        const newComments = newCommentsRaw.map((c: any) => ({
          _id: String(c._id),
          user: c.user,
          course: String(c.course),
          content: c.content,
          contentRate: c.contentRate,
          homeworkRate: c.homeworkRate,
          examRate: c.examRate,
          likes:
            typeof c.likesCount === 'number'
              ? c.likesCount
              : Array.isArray(c.likes)
              ? c.likes.length
              : 0,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        }))

        if (reset) {
          setComments(newComments)
        } else {
          setComments((prev) => [...prev, ...newComments])
        }

        setHasMore(Boolean(data.hasMore))
      } catch (e) {
        console.error('fetchComments 실패:', e)
        setError('댓글을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [courseId, sort, page]
  )

  useEffect(() => {
    if (!courseId) return
    ;(async () => {
      await refreshStats()
      await fetchComments({ reset: true })
    })()
  }, [courseId, sort, refreshStats, fetchComments])

  // 새 댓글 작성
  async function createComment(payload: {
    content: string
    contentRate: number
    homeworkRate: number
    examRate: number
    userId: string
  }) {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          ...payload,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.ok) {
        console.error('createComment 실패 응답:', res.status, data)
        return
      }

      await refreshStats()
      await fetchComments({ reset: true })
    } catch (e) {
      console.error('createComment 실패:', e)
    }
  }

  // 좋아요 토글
  async function toggleLike(commentId: string) {
    try {
      const res = await fetch('/api/comments/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      })

      if (!res.ok) return
      const data = await res.json()
      if (!data.ok) return

      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, likes: data.likes as number } : c
        )
      )
    } catch (e) {
      console.error('toggleLike 실패:', e)
    }
  }

  // 댓글 수정
  async function editComment(
    id: string,
    fields: {
      content: string
      contentRate: number
      homeworkRate: number
      examRate: number
    }
  ) {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })

      if (!res.ok) return
      const data = await res.json()
      if (!data.ok) return

      await fetchComments({ reset: true })
      await refreshStats()
    } catch (e) {
      console.error('editComment 실패:', e)
    }
  }

  // 댓글 삭제
  async function deleteComment(id: string) {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) return
      const data = await res.json()
      if (!data.ok) return

      setComments((prev) => prev.filter((c) => c._id !== id))
      await refreshStats()
    } catch (e) {
      console.error('deleteComment 실패:', e)
    }
  }

  // 더보기
  async function loadMore() {
    if (!hasMore || loadingMore) return
    await fetchComments({ reset: false, pageParam: page + 1 })
  }

  return {
    comments,
    stats,
    sort,
    page,
    hasMore,
    loading,
    loadingMore,
    error,

    setSort,
    setPage,

    refreshStats,
    fetchComments,
    loadMore,
    createComment,
    toggleLike,
    editComment,
    deleteComment,
  }
}
