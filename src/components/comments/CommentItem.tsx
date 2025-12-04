'use client'

import { useState } from 'react'
import StarRatingInput from './StarRatingInput'

interface Comment {
  _id: string
  user: string
  course: string
  content: string
  contentRate: number
  homeworkRate: number
  examRate: number
  likes: number
  createdAt: string
  updatedAt: string
}

interface Props {
  comment: Comment
  currentUserId: string | null
  onLike: () => void
  onEdit: (fields: {
    content: string
    contentRate: number
    homeworkRate: number
    examRate: number
  }) => void | Promise<void>
  onDelete: () => void | Promise<void>
}

export default function CommentItem({
  comment,
  currentUserId,
  onLike,
  onEdit,
  onDelete,
}: Props) {
  const isMine = currentUserId === comment.user

  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(comment.content)
  const [contentRate, setContentRate] = useState(comment.contentRate)
  const [homeworkRate, setHomeworkRate] = useState(comment.homeworkRate)
  const [examRate, setExamRate] = useState(comment.examRate)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (saving) return
    setSaving(true)
    try {
      await onEdit({
        content,
        contentRate,
        homeworkRate,
        examRate,
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <div className="border p-3 rounded bg-white">
        <textarea
          aria-label="내용"
          className="w-full border p-2 rounded mb-2"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-8 mb-3 text-sm">
          <div>
            <p className="mb-1">내용</p>
            <StarRatingInput
              value={contentRate}
              onChange={setContentRate}
              size={20}
            />
          </div>
          <div>
            <p className="mb-1">숙제</p>
            <StarRatingInput
              value={homeworkRate}
              onChange={setHomeworkRate}
              size={20}
            />
          </div>
          <div>
            <p className="mb-1">시험</p>
            <StarRatingInput
              value={examRate}
              onChange={setExamRate}
              size={20}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-3 py-1 rounded mr-2 text-sm"
          disabled={saving}
        >
          {saving ? '저장중...' : '저장'}
        </button>
        <button
          onClick={() => {
            setEditing(false)
            setContent(comment.content)
            setContentRate(comment.contentRate)
            setHomeworkRate(comment.homeworkRate)
            setExamRate(comment.examRate)
          }}
          className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
        >
          취소
        </button>
      </div>
    )
  }

  return (
    <div className="border p-3 rounded bg-white">
      <p className="text-sm mb-1 whitespace-pre-line">{comment.content}</p>
      <p className="text-xs text-gray-500 mb-2">
        ⭐ 내용 {comment.contentRate} / 숙제 {comment.homeworkRate} / 시험{' '}
        {comment.examRate}
      </p>

      <button onClick={onLike} className="text-sm text-red-500 mr-4">
        ❤️ {comment.likes}
      </button>

      {isMine && (
        <>
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-blue-600 mr-2"
          >
            ✏️ 수정
          </button>
          <button onClick={onDelete} className="text-sm text-gray-600">
            🗑 삭제
          </button>
        </>
      )}
    </div>
  )
}
