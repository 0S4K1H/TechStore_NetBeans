import { useId } from 'react'

import { motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/lib/utils'

function FlowBeam({ side, delay = 0, accent = 'cyan' }) {
  const reduceMotion = useReducedMotion()
  const isRight = side === 'right'

  return (
    <motion.div
      aria-hidden
      className={cn(
        'absolute top-[-22%] h-56 w-8 rounded-full blur-3xl md:h-[34rem] md:w-10',
        accent === 'blue'
          ? 'bg-gradient-to-b from-transparent via-sky-300/70 to-transparent'
          : 'bg-gradient-to-b from-transparent via-cyan-300/75 to-transparent',
        isRight ? 'right-[12%]' : 'left-[12%]'
      )}
      animate={
        reduceMotion
          ? undefined
          : {
              y: [-240, 980],
              x: [0, isRight ? -14 : 14, 0],
              opacity: [0, 0.95, 0],
              scale: [0.85, 1.08, 0.85],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              duration: accent === 'blue' ? 12.5 : 10.5,
              repeat: Infinity,
              ease: 'linear',
              delay,
            }
      }
    />
  )
}

function BreezeLane({ side }) {
  const reduceMotion = useReducedMotion()
  const laneId = useId().replace(/:/g, '')
  const isRight = side === 'right'

  const laneMask = isRight
    ? 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 100%)'
    : 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 100%)'

  const laneMotion = reduceMotion
    ? undefined
    : {
        x: [0, isRight ? 20 : -20, 0],
        y: [0, -14, 10, 0],
        opacity: [0.82, 1, 0.82],
      }

  const laneTransition = reduceMotion
    ? undefined
    : { duration: 12, repeat: Infinity, ease: 'easeInOut' }

  const primaryMotion = reduceMotion
    ? undefined
    : {
        x: [0, isRight ? 18 : -18, 0],
        y: [0, -16, 12, 0],
        opacity: [0.55, 1, 0.72, 1, 0.55],
      }

  const secondaryMotion = reduceMotion
    ? undefined
    : {
        x: [0, isRight ? -14 : 14, 0],
        y: [0, 12, -10, 0],
        opacity: [0.28, 0.72, 0.42, 0.72, 0.28],
      }

  const tertiaryMotion = reduceMotion
    ? undefined
    : {
        x: [0, isRight ? 10 : -10, 0],
        y: [0, -8, 6, 0],
        opacity: [0.14, 0.45, 0.22, 0.45, 0.14],
      }

  return (
    <div
      aria-hidden
      className={cn(
        'absolute inset-y-0 hidden w-[clamp(11rem,18vw,22rem)] overflow-hidden md:block',
        isRight ? 'right-0' : 'left-0'
      )}
      style={{
        WebkitMaskImage: laneMask,
        maskImage: laneMask,
      }}
    >
      <motion.div
        className={cn(
          'absolute inset-y-[8%] w-[160%] rounded-full blur-[72px]',
          isRight ? '-left-[10%] bg-sky-500/10' : '-right-[10%] bg-cyan-400/10'
        )}
        animate={reduceMotion ? undefined : { opacity: [0.2, 0.5, 0.2], scale: [0.98, 1.04, 0.98] }}
        transition={reduceMotion ? undefined : { duration: 9.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.svg
        viewBox="0 0 520 1400"
        preserveAspectRatio="none"
        className={cn('absolute inset-0 h-full w-full origin-center', isRight && 'scale-x-[-1]')}
        animate={laneMotion}
        transition={laneTransition}
      >
        <defs>
          <linearGradient id={`${laneId}-primary`} x1="0%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="30%" stopColor="#0ea5e9" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.98" />
          </linearGradient>
          <linearGradient id={`${laneId}-secondary`} x1="100%" y1="100%" x2="20%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="30%" stopColor="#0ea5e9" stopOpacity="0.22" />
            <stop offset="72%" stopColor="#22d3ee" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.92" />
          </linearGradient>
          <filter id={`${laneId}-blur`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        <motion.path
          d="M-70 40 C 55 180, 126 330, 98 540 S 44 940, 154 1385"
          stroke={`url(#${laneId}-primary)`}
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${laneId}-blur)`}
          opacity="0.3"
          fill="none"
          animate={primaryMotion}
          transition={reduceMotion ? undefined : { duration: 10.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M-70 40 C 55 180, 126 330, 98 540 S 44 940, 154 1385"
          stroke={`url(#${laneId}-primary)`}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.98"
          fill="none"
          animate={primaryMotion}
          transition={reduceMotion ? undefined : { duration: 10.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.path
          d="M10 -20 C 132 120, 206 300, 168 500 S 106 860, 242 1420"
          stroke={`url(#${laneId}-secondary)`}
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${laneId}-blur)`}
          opacity="0.24"
          fill="none"
          animate={secondaryMotion}
          transition={reduceMotion ? undefined : { duration: 12.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        />
        <motion.path
          d="M10 -20 C 132 120, 206 300, 168 500 S 106 860, 242 1420"
          stroke={`url(#${laneId}-secondary)`}
          strokeWidth="2.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.88"
          fill="none"
          animate={secondaryMotion}
          transition={reduceMotion ? undefined : { duration: 12.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        />

        <motion.path
          d="M55 0 C 170 140, 230 320, 190 520 S 130 850, 266 1400"
          stroke={`url(#${laneId}-primary)`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${laneId}-blur)`}
          opacity="0.18"
          fill="none"
          animate={tertiaryMotion}
          transition={reduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        />
      </motion.svg>

      <FlowBeam side={side} delay={isRight ? 0.6 : 0.2} accent="cyan" />
      <FlowBeam side={side} delay={isRight ? 2.1 : 1.3} accent="blue" />
    </div>
  )
}

export function StorefrontAtmosphere() {
  const reduceMotion = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(14,165,233,0.08),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(34,211,238,0.05),transparent_44%)]"
        animate={reduceMotion ? undefined : { opacity: [0.72, 1, 0.72] }}
        transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-x-[18%] top-0 h-32 bg-gradient-to-b from-cyan-400/10 to-transparent blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 18, 0], opacity: [0.28, 0.62, 0.28] }}
        transition={reduceMotion ? undefined : { duration: 9.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-x-[18%] bottom-0 h-28 bg-gradient-to-t from-sky-500/10 to-transparent blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -18, 0], opacity: [0.22, 0.52, 0.22] }}
        transition={reduceMotion ? undefined : { duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <BreezeLane side="left" />
      <BreezeLane side="right" />
    </div>
  )
}
