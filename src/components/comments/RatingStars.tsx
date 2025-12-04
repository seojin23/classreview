interface Props {
  contentRate: number
  homeworkRate: number
  examRate: number
}

export default function RatingStars({
  contentRate,
  homeworkRate,
  examRate,
}: Props) {
  return (
    <div className="text-[11px] text-gray-500">
      ⭐ 내용 {contentRate.toFixed(1)} / 숙제 {homeworkRate.toFixed(1)} / 시험{' '}
      {examRate.toFixed(1)}
    </div>
  )
}
