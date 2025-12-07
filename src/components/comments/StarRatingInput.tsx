import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'

interface Props {
  value: number
  onChange: (v: number) => void
  size?: number
  disabled?: boolean
}

export default function StarRatingInput({
  value,
  onChange,
  size = 22,
  disabled = false,
}: Props) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onClick={() => !disabled && onChange(n)}
          className="cursor-pointer"
        >
          <FontAwesomeIcon
            icon={n <= value ? solidStar : regularStar}
            style={{
              fontSize: size,
              color: n <= value ? '#FFD700' : '#D0D0D0',
              cursor: disabled ? 'default' : 'pointer',
            }}
          />
        </span>
      ))}
    </div>
  )
}
