// src/components/comments/CommentEditor.tsx
'use client'

import { useState } from 'react'
import StarRatingInput from './StarRatingInput'

interface Props {
  userId: string | null
  onSubmit: (data: {
    content: string
    contentRate: number
    homeworkRate: number
    examRate: number
    userId: string
  }) => Promise<void> | void
}

export default function CommentEditor({ userId, onSubmit }: Props) {
  const [content, setContent] = useState('')
  const [contentRate, setContentRate] = useState(5)
  const [homeworkRate, setHomeworkRate] = useState(5)
  const [examRate, setExamRate] = useState(5)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!content.trim() || loading || !userId) return
    setLoading(true)

    try {
      await onSubmit({
        content,
        contentRate,
        homeworkRate,
        examRate,
        userId,
      })

      setContent('')
      setContentRate(5)
      setHomeworkRate(5)
      setExamRate(5)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="comment-editor-card">
      <textarea
        className="comment-textarea"
        rows={3}
        placeholder={
          userId ? '댓글을 입력하세요' : '로그인 후 댓글을 작성할 수 있습니다.'
        }
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={!userId}
      />

      <div className="grid grid-cols-3 gap-6 text-sm mb-4">
        <div>
          <p className="mb-2 font-semibold">내용</p>
          <StarRatingInput
            value={contentRate}
            onChange={setContentRate}
            disabled={!userId}
          />
        </div>

        <div>
          <p className="mb-2 font-semibold">숙제</p>
          <StarRatingInput
            value={homeworkRate}
            onChange={setHomeworkRate}
            disabled={!userId}
          />
        </div>

        <div>
          <p className="mb-2 font-semibold">시험</p>
          <StarRatingInput
            value={examRate}
            onChange={setExamRate}
            disabled={!userId}
          />
        </div>
      </div>

      <button
        onClick={handleClick}
        disabled={loading || !userId}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? '작성 중...' : '작성'}
      </button>
    </div>
  )
}
