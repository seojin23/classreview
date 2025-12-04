'use client'

import { useState } from 'react'
import StarRatingInput from './StarRatingInput'

interface Props {
  onSubmit: (data: {
    content: string
    contentRate: number
    homeworkRate: number
    examRate: number
  }) => Promise<void> | void
}

export default function CommentEditor({ onSubmit }: Props) {
  const [content, setContent] = useState('')
  const [contentRate, setContentRate] = useState(5)
  const [homeworkRate, setHomeworkRate] = useState(5)
  const [examRate, setExamRate] = useState(5)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!content.trim() || loading) return
    setLoading(true)
    try {
      await onSubmit({
        content,
        contentRate,
        homeworkRate,
        examRate,
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
    <div className="border p-4 rounded bg-white mb-8">
      <textarea
        className="w-full border p-2 rounded mb-4"
        rows={3}
        placeholder="댓글을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="grid grid-cols-3 gap-6 mb-4 text-sm">
        <div>
          <p className="mb-2">내용</p>
          <StarRatingInput value={contentRate} onChange={setContentRate} />
        </div>
        <div>
          <p className="mb-2">숙제</p>
          <StarRatingInput value={homeworkRate} onChange={setHomeworkRate} />
        </div>
        <div>
          <p className="mb-2">시험</p>
          <StarRatingInput value={examRate} onChange={setExamRate} />
        </div>
      </div>

      <button
        onClick={handleClick}
        className="bg-sky-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? '작성 중...' : '작성'}
      </button>
    </div>
  )
}
