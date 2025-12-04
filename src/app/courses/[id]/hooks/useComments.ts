'use client'
import { useState } from 'react'

export function useComments(courseId: string) {
  const [sort, setSort] = useState<'latest' | 'like'>('latest')
  const [page, setPage] = useState(1)
  const [comments, setComments] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)

  async function fetchStats() {
    const res = await fetch(`/api/comments/stats?courseId=${courseId}`)
    if (!res.ok) return null
    return res.json()
  }

  async function fetchComments(reset = false) {
    const res = await fetch(
      `/api/comments/query?courseId=${courseId}&sort=${sort}&page=${
        reset ? 1 : page
      }`
    )
    const data = await res.json()

    if (reset) {
      setComments(data.comments)
      setHasMore(data.hasMore)
      setPage(1)
    } else {
      setComments((prev) => [...prev, ...data.comments])
      setHasMore(data.hasMore)
    }
  }

  return {
    sort,
    setSort,
    page,
    setPage,
    comments,
    hasMore,
    fetchStats,
    fetchComments,
  }
}
