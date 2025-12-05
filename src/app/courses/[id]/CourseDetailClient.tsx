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
      <div className="detail-error">
        강의 정보를 불러올 수 없습니다. (courseId 없음)
      </div>
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
    <>
      {/* ===========================
          평점 통계 카드
      =========================== */}
      <section className="stat-card">
        {/* 오른쪽 위 참여 인원 */}
        <div className="stat-count-top">총 {stats.total}명 참여</div>

        <h2 className="stat-title">평점 통계</h2>

        {/* 종합 평점 (가운데 크게) */}
        <div className="stat-main">
          <p className="stat-main-label">종합 평점</p>

          <div className="stat-main-stars">
            <RatingStars
              score={stats.avgAll}
              count={stats.total}
              showCount={false}
              showValue={false}
              size={30}
            />
          </div>

          <p className="stat-main-score">{stats.avgAll.toFixed(2)} / 5.0</p>
        </div>

        {/* 세부 평점 3개 - 가로 정렬 */}
        <div className="stat-row">
          <div className="stat-item">
            <p className="stat-item-label">강의력</p>
            <div className="stat-stars">
              <RatingStars
                score={stats.avgContent}
                count={stats.total}
                showCount={false}
                showValue={false}
              />
            </div>
            <p className="stat-item-score">{stats.avgContent.toFixed(2)}</p>
          </div>

          <div className="stat-item">
            <p className="stat-item-label">과제량</p>
            <div className="stat-stars">
              <RatingStars
                score={stats.avgHomework}
                count={stats.total}
                showCount={false}
                showValue={false}
              />
            </div>
            <p className="stat-item-score">{stats.avgHomework.toFixed(2)}</p>
          </div>

          <div className="stat-item">
            <p className="stat-item-label">시험 난이도</p>
            <div className="stat-stars">
              <RatingStars
                score={stats.avgExam}
                count={stats.total}
                showCount={false}
                showValue={false}
              />
            </div>
            <p className="stat-item-score">{stats.avgExam.toFixed(2)}</p>
          </div>
        </div>
      </section>

      {/* ===========================
          댓글 작성 카드
      =========================== */}
      <section className="comment-editor-card">
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

      {/* 정렬 드롭다운 */}
      <div className="sort-area">
        <select
          aria-label="정렬"
          value={sort}
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="latest">최신순</option>
          <option value="like">좋아요순</option>
        </select>
      </div>

      {/* ===========================
          댓글 리스트
      =========================== */}
      <section className="comment-list">
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

        {hasMore && (
          <div className="loadmore-area">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="loadmore-btn"
            >
              {loadingMore ? '불러오는 중...' : '더 보기'}
            </button>
          </div>
        )}
      </section>
    </>
  )
}
