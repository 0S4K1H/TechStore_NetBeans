import { useId } from 'react'

import { motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/lib/utils'

export function CinematicGlow({ className }) {
  const reduceMotion = useReducedMotion()
  const glowId = useId().replace(/:/g, '')

  const drift = reduceMotion
    ? undefined
    : {
        x: [0, 8, 0],
        y: [0, -6, 0],
        opacity: [0.7, 1, 0.7],
      }

  const glowTransition = reduceMotion
    ? undefined
    : { duration: 7.5, repeat: Infinity, ease: 'easeInOut' }

  const pulse = reduceMotion
    ? undefined
    : {
        opacity: [0.35, 0.8, 0.35],
        scale: [0.96, 1.04, 0.96],
      }

  const pulseTransition = reduceMotion
    ? undefined
    : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }

  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen', className)}>
      <motion.div
        className="absolute inset-x-[12%] bottom-[4%] h-14 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.45),rgba(14,165,233,0.12)_42%,transparent_76%)] blur-3xl"
        animate={pulse}
        transition={pulseTransition}
      />

      <motion.svg
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        animate={drift}
        transition={glowTransition}
      >
        <defs>
          <linearGradient id={`${glowId}-blue`} x1="0%" y1="100%" x2="70%" y2="10%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="35%" stopColor="#0ea5e9" stopOpacity="0.32" />
            <stop offset="72%" stopColor="#38bdf8" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.96" />
          </linearGradient>
          <linearGradient id={`${glowId}-aqua`} x1="100%" y1="100%" x2="30%" y2="10%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="35%" stopColor="#0ea5e9" stopOpacity="0.32" />
            <stop offset="72%" stopColor="#22d3ee" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.96" />
          </linearGradient>
          <filter id={`${glowId}-blur`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        <path
          d="M-40 600 C 130 545, 190 470, 305 390 S 520 230, 615 70"
          stroke={`url(#${glowId}-blue)`}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId}-blur)`}
          opacity="0.65"
          fill="none"
        />
        <path
          d="M-40 600 C 130 545, 190 470, 305 390 S 520 230, 615 70"
          stroke={`url(#${glowId}-blue)`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
          fill="none"
        />

        <path
          d="M1040 600 C 870 545, 810 470, 695 390 S 480 230, 385 70"
          stroke={`url(#${glowId}-aqua)`}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId}-blur)`}
          opacity="0.65"
          fill="none"
        />
        <path
          d="M1040 600 C 870 545, 810 470, 695 390 S 480 230, 385 70"
          stroke={`url(#${glowId}-aqua)`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
          fill="none"
        />

        <path
          d="M120 640 C 280 590, 390 530, 500 420 S 720 290, 885 120"
          stroke={`url(#${glowId}-blue)`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId}-blur)`}
          opacity="0.28"
          fill="none"
        />
      </motion.svg>

      <motion.div
        className="absolute inset-x-[18%] bottom-[2%] h-5 rounded-full bg-cyan-400/25 blur-xl"
        animate={pulse}
        transition={pulseTransition}
      />
    </div>
  )
}
