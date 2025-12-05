// src/components/comments/RatingStars.tsx

interface RatingStarsProps {
  score: number // 종합 평점
  count: number // 평가 참여 수
  size?: number
}

export default function RatingStars({
  score,
  count,
  size = 16,
}: RatingStarsProps) {
  if (!count || score <= 0) {
    return <div className="text-[11px] text-gray-400">아직 평가가 없어요</div>
  }

  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center gap-1 text-[11px] text-gray-700">
      <div className="flex">
        {stars.map((star) => (
          <span
            key={star}
            style={{ fontSize: size }}
            className={
              star <= Math.round(score) ? 'text-yellow-400' : 'text-gray-300'
            }
          >
            ★
          </span>
        ))}
      </div>

      <span>{score.toFixed(1)} / 5.0</span>

      <span className="text-[10px] text-gray-400">({count}명)</span>
    </div>
  )
}
