// src/components/comments/CommentItem.tsx
'use client'

import { useState } from 'react'
import StarRatingInput from './StarRatingInput'
import RatingStars from './RatingStars'

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
  }) => Promise<void> | void
  onDelete: () => Promise<void> | void
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

  /* ✏️ 수정 모드 */
  if (editing) {
    return (
      <div className="comment-item-card">
        <textarea
          aria-label="댓글 내용 수정"
          className="comment-edit-textarea"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-8 mb-4 text-sm">
          <div>
            <p className="mb-1 font-semibold">내용</p>
            <StarRatingInput value={contentRate} onChange={setContentRate} />
          </div>

          <div>
            <p className="mb-1 font-semibold">숙제</p>
            <StarRatingInput value={homeworkRate} onChange={setHomeworkRate} />
          </div>

          <div>
            <p className="mb-1 font-semibold">시험</p>
            <StarRatingInput value={examRate} onChange={setExamRate} />
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

  /* 📝 읽기 모드 */
  return (
    <div className="comment-item-card">
      <p className="text-sm mb-3 whitespace-pre-line">{comment.content}</p>

      {/* 별점 3개 가로 정렬 + (n명) 표시 없음 */}
      <div className="flex gap-10 mb-3 text-sm items-center">
        <div>
          <p className="font-semibold mb-1">내용</p>
          <RatingStars
            score={comment.contentRate}
            count={1}
            showCount={false}
            showValue={false}
          />
        </div>

        <div>
          <p className="font-semibold mb-1">숙제</p>
          <RatingStars
            score={comment.homeworkRate}
            count={1}
            showCount={false}
            showValue={false}
          />
        </div>

        <div>
          <p className="font-semibold mb-1">시험</p>
          <RatingStars
            score={comment.examRate}
            count={1}
            showCount={false}
            showValue={false}
          />
        </div>
      </div>

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
          <button onClick={() => onDelete()} className="text-sm text-gray-600">
            🗑 삭제
          </button>
        </>
      )}
    </div>
  )
}
