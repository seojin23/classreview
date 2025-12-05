// src/components/comments/RatingStars.tsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar as solidStar,
  faStarHalfStroke,
} from '@fortawesome/free-solid-svg-icons'
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'

interface RatingStarsProps {
  score: number
  count?: number
  size?: number
  showCount?: boolean
  showValue?: boolean
}

export default function RatingStars({
  score,
  count,
  size = 16,
  showCount = true,
  showValue = true,
}: RatingStarsProps) {
  // 평가 없음 → "아직 평가가 없어요"
  if (!count || score <= 0) {
    return <div className="rating-stars no-rating">아직 평가가 없어요</div>
  }

  const stars = []
  const full = Math.floor(score)
  const decimal = score - full
  const hasHalf = decimal >= 0.25 && decimal < 0.75
  const totalFullStars = hasHalf ? full : Math.round(score)

  for (let i = 0; i < totalFullStars; i++) {
    stars.push(
      <FontAwesomeIcon
        key={`full-${i}`}
        icon={solidStar}
        style={{ fontSize: size, color: '#FFD700' }}
      />
    )
  }

  if (hasHalf) {
    stars.push(
      <FontAwesomeIcon
        key="half"
        icon={faStarHalfStroke}
        style={{ fontSize: size, color: '#FFD700' }}
      />
    )
  }

  while (stars.length < 5) {
    stars.push(
      <FontAwesomeIcon
        key={`empty-${stars.length}`}
        icon={regularStar}
        style={{ fontSize: size, color: '#D0D0D0' }}
      />
    )
  }

  return (
    <div className="rating-stars">
      <div className="flex items-center gap-[2px]">{stars}</div>
      {showValue && (
        <span className="text-[11px] text-gray-700 ml-1">
          {score.toFixed(1)} / 5.0
        </span>
      )}
      {showCount && typeof count === 'number' && (
        <span className="text-[10px] text-gray-400 ml-1">({count}명)</span>
      )}
    </div>
  )
}
