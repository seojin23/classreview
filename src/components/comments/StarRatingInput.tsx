// src/components/comments/StarRatingInput.tsx
'use client'

interface Props {
  value: number
  onChange: (n: number) => void
  size?: number
  disabled?: boolean
}

export default function StarRatingInput({
  value,
  onChange,
  size = 24,
  disabled = false,
}: Props) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => !disabled && onChange(n)}
          disabled={disabled}
          className={disabled ? 'opacity-40 cursor-not-allowed' : ''}
        >
          <span style={{ fontSize: size }}>{n <= value ? '⭐' : '☆'}</span>
        </button>
      ))}
    </div>
  )
}
