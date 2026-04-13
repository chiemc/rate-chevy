'use client'

import { motion } from 'framer-motion'
import type { TrafficStatus } from '@/types'

interface Props {
  status: TrafficStatus
  size?: 'sm' | 'lg'
}

const lights: { color: TrafficStatus; bg: string; glow: string; emoji: string }[] = [
  { color: 'red', bg: '#ef4444', glow: '#fca5a5', emoji: '🔴' },
  { color: 'yellow', bg: '#eab308', glow: '#fde047', emoji: '🟡' },
  { color: 'green', bg: '#22c55e', glow: '#86efac', emoji: '🟢' },
]

export default function TrafficLight({ status, size = 'lg' }: Props) {
  const ballSize = size === 'lg' ? 80 : 40
  const housing = size === 'lg' ? 120 : 65

  return (
    <div
      className="flex flex-col items-center gap-3 rounded-3xl bg-stone-800 py-5 px-4 mx-auto"
      style={{ width: housing }}
    >
      {lights.map((light) => {
        const active = status === light.color
        return (
          <motion.div
            key={light.color}
            animate={
              active
                ? {
                    backgroundColor: light.bg,
                    boxShadow: `0 0 ${size === 'lg' ? 30 : 15}px ${size === 'lg' ? 20 : 10}px ${light.glow}`,
                    scale: 1.05,
                  }
                : {
                    backgroundColor: '#374151',
                    boxShadow: 'none',
                    scale: 1,
                  }
            }
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              width: ballSize,
              height: ballSize,
              borderRadius: '50%',
            }}
          />
        )
      })}
    </div>
  )
}
