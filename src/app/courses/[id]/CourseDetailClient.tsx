// src/app/courses/[id]/CourseDetailClient.tsx
'use client'

import type { ChangeEvent } from 'react'
import { useUser } from '@clerk/nextjs'
import RatingStars from '@/components/comments/RatingStars'
import CommentItem from '@/components/comments/CommentItem'
import CommentEditor from '@/components/comments/CommentEditor'
import { useComments } from './hooks/useComments'

export default function CourseDetailClient({ course }: { course: any }) {
  const courseId = course?._id

  if (!courseId) {
    return (
      <div className="p-6">강의 정보를 불러올 수 없습니다. (courseId 없음)</div>
    )
  }

  const { user } = useUser()
  const currentUserId = user?.id ?? null

  const {
    comments,
    stats,
    sort,
    hasMore,
    loading,
    loadingMore,

    setSort,
    loadMore,
    createComment,
    toggleLike,
    editComment,
    deleteComment,
  } = useComments(courseId)

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as 'latest' | 'like')
  }

  return (
    <div className="space-y-8">
      {/* 1) 강의 기본 정보 */}
      <section className="p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600">{course.professor?.name ?? '정보 없음'}</p>

        {course.description && (
          <p className="text-gray-500 mt-1 whitespace-pre-line">
            {course.description}
          </p>
        )}
      </section>

      {/* 2) 평점 통계 */}
      <section className="p-6 bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-bold">평점 통계</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">종합 평점</p>
            <RatingStars score={stats.avgAll} count={stats.total} />
            <p className="text-gray-500">{stats.avgAll.toFixed(2)} / 5</p>
          </div>

          <div>
            <p className="font-semibold">강의력</p>
            <RatingStars score={stats.avgContent} count={stats.total} />
            <p className="text-gray-500">{stats.avgContent.toFixed(2)}</p>
          </div>

          <div>
            <p className="font-semibold">과제량</p>
            <RatingStars score={stats.avgHomework} count={stats.total} />
            <p className="text-gray-500">{stats.avgHomework.toFixed(2)}</p>
          </div>

          <div>
            <p className="font-semibold">시험 난이도</p>
            <RatingStars score={stats.avgExam} count={stats.total} />
            <p className="text-gray-500">{stats.avgExam.toFixed(2)}</p>
          </div>
        </div>

        <p className="text-gray-500 text-sm">총 댓글 수: {stats.total}</p>
      </section>

      {/* 3) 댓글 작성 */}
      <section className="p-6 bg-white rounded-xl shadow-md">
        <CommentEditor
          userId={currentUserId}
          onSubmit={async ({
            content,
            contentRate,
            homeworkRate,
            examRate,
            userId,
          }) => {
            if (!userId) return
            await createComment({
              content,
              contentRate,
              homeworkRate,
              examRate,
              userId,
            })
          }}
        />
      </section>

      {/* 4) 정렬 */}
      <div className="flex justify-end">
        <select
          aria-label="정렬"
          value={sort}
          onChange={handleSortChange}
          className="border rounded-lg p-2"
        >
          <option value="latest">최신순</option>
          <option value="like">좋아요순</option>
        </select>
      </div>

      {/* 5) 댓글 리스트 */}
      <section className="space-y-4">
        {loading && comments.length === 0 && (
          <p className="text-center text-gray-500">댓글을 불러오는 중...</p>
        )}

        {!loading && comments.length === 0 && (
          <p className="text-center text-gray-400">아직 댓글이 없습니다.</p>
        )}

        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            currentUserId={currentUserId}
            onLike={() => toggleLike(comment._id)}
            onEdit={(fields) => editComment(comment._id, fields)}
            onDelete={() => deleteComment(comment._id)}
          />
        ))}

        {/* 6) 더보기 */}
        {hasMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              {loadingMore ? '불러오는 중...' : '더 보기'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
