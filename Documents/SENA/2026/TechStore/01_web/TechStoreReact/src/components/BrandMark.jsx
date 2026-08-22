import { motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/lib/utils'

function TechStoreGlyph({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={cn('block', className)}>
      <path
        d="M32 4.5 54.5 17.5V46.5L32 59.5 9.5 46.5V17.5L32 4.5Z"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M32 15.5V48.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M21 23.5 32 32.5 43 23.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 40.5 32 31.5 43 40.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="4.25" fill="currentColor" />
      <circle cx="21" cy="23.5" r="2.35" fill="currentColor" />
      <circle cx="43" cy="23.5" r="2.35" fill="currentColor" />
      <circle cx="21" cy="40.5" r="2.35" fill="currentColor" />
      <circle cx="43" cy="40.5" r="2.35" fill="currentColor" />
      <circle cx="32" cy="15.5" r="2.15" fill="currentColor" />
      <circle cx="32" cy="48.5" r="2.15" fill="currentColor" />
    </svg>
  )
}

function BrandBreeze({ featured }) {
  const reduceMotion = useReducedMotion()

  if (!featured) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-[-18px] z-0 overflow-hidden rounded-[1.85rem]"
    >
      <motion.div
        className="absolute inset-x-[12%] top-[14%] h-16 rounded-full bg-cyan-400/12 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 8, 0], opacity: [0.35, 0.72, 0.35], scale: [0.98, 1.03, 0.98] }}
        transition={reduceMotion ? undefined : { duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-3 rounded-[1.35rem] border border-cyan-300/12"
        animate={reduceMotion ? undefined : { rotate: [0, 0.8, -0.8, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={reduceMotion ? undefined : { duration: 9.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-x-[20%] bottom-[18%] h-10 rounded-full bg-sky-400/10 blur-2xl"
        animate={reduceMotion ? undefined : { x: [0, -6, 0], opacity: [0.18, 0.42, 0.18], scale: [0.98, 1.04, 0.98] }}
        transition={reduceMotion ? undefined : { duration: 7.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      />
    </motion.div>
  )
}

export function BrandMark({ small = false, featured = false, className }) {
  const reduceMotion = useReducedMotion()

  const iconSize = featured
    ? small
      ? 'h-11 w-11 sm:h-12 sm:w-12'
      : 'h-14 w-14 sm:h-16 sm:w-16'
    : small
      ? 'h-8 w-8 sm:h-9 sm:w-9'
      : 'h-9 w-9 sm:h-10 sm:w-10'

  const wordmarkSize = featured
    ? small
      ? 'text-[0.88rem] sm:text-[1rem]'
      : 'text-[1.02rem] sm:text-[1.2rem]'
    : small
      ? 'text-[0.76rem] sm:text-[0.84rem]'
      : 'text-[0.88rem] sm:text-[0.96rem]'

  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-start overflow-visible whitespace-nowrap',
        featured &&
          'rounded-[1.65rem] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(7,18,36,0.98),rgba(10,17,31,0.9))] px-5 py-4 shadow-[0_18px_48px_rgba(2,8,23,0.34)] backdrop-blur-2xl',
        className
      )}
    >
      <BrandBreeze featured={featured} />

      <span className="relative z-10 inline-flex items-center gap-3">
        <motion.span
          className={cn(
            'grid shrink-0 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10',
            iconSize
          )}
          animate={reduceMotion ? undefined : { y: [0, -2, 0], rotate: [0, -1.5, 0], scale: [1, 1.03, 1] }}
          transition={reduceMotion ? undefined : { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <TechStoreGlyph className={cn('text-cyan-300', featured && 'opacity-95')} />
        </motion.span>

        <span className="min-w-0 leading-none">
          <span className={cn('block font-semibold tracking-[0.24em] uppercase', wordmarkSize)}>
            <span className="text-cyan-300">Tech</span>
            <span className="text-white">Store</span>
          </span>
          {!small ? (
            <span className="mt-1 block text-[11px] tracking-[0.28em] uppercase text-white/65">
              Tecnología sin límites
            </span>
          ) : null}
        </span>
      </span>
    </span>
  )
}
