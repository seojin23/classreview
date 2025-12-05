// src/components/comments/RatingStars.tsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar as solidStar,
  faStarHalfStroke,
} from '@fortawesome/free-solid-svg-icons'
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'

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
  // 평가가 아직 없는 경우
  if (!count || score <= 0) {
    return <div className="text-[11px] text-gray-400">아직 평가가 없어요</div>
  }

  const stars = []

  const full = Math.floor(score) // 꽉찬 별 개수
  const decimal = score - full // 소수점
  const hasHalf = decimal >= 0.25 && decimal < 0.75 // 반쪽 조건

  const totalFullStars = hasHalf ? full : Math.round(score)

  // 꽉찬 별 추가
  for (let i = 0; i < totalFullStars; i++) {
    stars.push(
      <FontAwesomeIcon
        key={`full-${i}`}
        icon={solidStar}
        style={{ fontSize: size, color: '#FFD700' }}
      />
    )
  }

  // 반쪽 별 추가
  if (hasHalf) {
    stars.push(
      <FontAwesomeIcon
        key="half"
        icon={faStarHalfStroke}
        style={{ fontSize: size, color: '#FFD700' }}
      />
    )
  }

  // 빈 별 추가 (총 5개 맞추기)
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
    <div className="flex items-center gap-1 text-gray-700 text-[11px]">
      <div className="flex items-center gap-[2px]">{stars}</div>

      <span>{score.toFixed(1)} / 5.0</span>

      <span className="text-[10px] text-gray-400">({count}명)</span>
    </div>
  )
}
