import { motion } from 'motion/react'
import { cn } from '#/lib/utils.ts'

interface FlipCardProps {
  revealed: boolean
  color: string
  isWinner: boolean
  imageSrc: string
  onClick: () => void
  cardSize: number
  disabled: boolean
  matchHighlight: boolean
}

export function SlotMachineFlipCard({
  revealed,
  color,
  isWinner,
  imageSrc,
  onClick,
  disabled,
  matchHighlight,
}: FlipCardProps) {
  return (
    <div
      onClick={!disabled && !revealed ? onClick : undefined}
      className={cn(
        'relative w-full aspect-square',
        revealed || disabled ? 'cursor-default' : 'cursor-pointer'
      )}
      style={{ perspective: 900 }}
    >
      <motion.div
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg border-2 border-[var(--casino-line)] bg-gradient-to-br from-[#1c1c1c] to-[#0d0d0d]"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {!disabled && !revealed && (
            <span className="select-none text-[var(--casino-text-mute)] text-2xl">
              ?
            </span>
          )}
        </div>

        <motion.div
          animate={
            matchHighlight
              ? { boxShadow: [`0 0 12px ${color}88`, `0 0 32px ${color}cc`, `0 0 12px ${color}88`] }
              : {}
          }
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-lg"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            border: `2px solid ${isWinner ? '#f59e0b' : color}${matchHighlight ? 'ff' : '55'}`,
            background: `linear-gradient(145deg,${color}22,${color}10)`,
          }}
        >
          <img
            src={imageSrc}
            alt=""
            draggable={false}
            className="w-[60%] h-[60%] object-contain rounded-lg"
          />

          {isWinner && matchHighlight && (
            <span className="text-[9px] font-black text-amber-400 tracking-widest uppercase">
              WIN!
            </span>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}