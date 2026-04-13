'use client'

import { motion } from 'framer-motion'

interface Props {
  rating: number
  max?: number
  editable?: boolean
  size?: 'sm' | 'md' | 'lg'
  onChange?: (rating: number) => void
}

const sizes = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-5xl',
}

export default function StarRating({
  rating,
  max = 5,
  editable = false,
  size = 'md',
  onChange,
}: Props) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < rating
        return (
          <motion.button
            key={i}
            type="button"
            disabled={!editable}
            onClick={() => editable && onChange?.(i + 1)}
            whileTap={editable ? { scale: 1.3 } : undefined}
            animate={{ scale: filled ? 1 : 0.85, opacity: filled ? 1 : 0.3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`${sizes[size]} select-none ${editable ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
          >
            ⭐
          </motion.button>
        )
      })}
    </div>
  )
}
