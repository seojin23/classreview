'use client'

interface Props {
  value: number
  onChange: (value: number) => void
  size?: number
}

export default function StarRatingInput({ value, onChange, size = 24 }: Props) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex gap-1 select-none">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0 m-0 border-none bg-transparent cursor-pointer leading-none"
          style={{ fontSize: size }}
        >
          <span className={star <= value ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        </button>
      ))}
    </div>
  )
}
