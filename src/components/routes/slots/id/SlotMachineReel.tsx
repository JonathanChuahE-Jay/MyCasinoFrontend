import { animate } from 'motion'
import placeholder from '#/assets/common/slot-machine.png'
import React from 'react'

const STRIP_LENGTH = 40

function buildStrip(n: number, symbolImages: string[]): string[] {
  const imgs = symbolImages.length > 0 ? symbolImages : [placeholder]
  return Array.from({ length: n }, () => imgs[Math.floor(Math.random() * imgs.length)])
}

function buildGoldCoilStrip(preLength: number, resultGoldCol: boolean[]): boolean[] {
  const pre: boolean[] = []
  let i = 0
  while (i < preLength) {
    if (Math.random() < 0.3) {
      const run = Math.floor(Math.random() * 4) + 1
      for (let j = 0; j < run && i < preLength; j++, i++) pre.push(true)
    } else {
      const gap = Math.floor(Math.random() * 6) + 1
      for (let j = 0; j < gap && i < preLength; j++, i++) pre.push(false)
    }
  }
  return [...pre, ...resultGoldCol]
}

export interface ReelHandle {
  spinTo: (symbols: string[], resultGoldCol: boolean[], onDone: () => void, snap?: boolean) => void
}

interface SlotReelProps {
  rows: number
  symbolSize: number
  symbolImages: string[]
  reelRef: (h: ReelHandle | null) => void
}

export function SlotMachineReel({ rows, symbolSize, symbolImages, reelRef }: SlotReelProps) {
  const stripEl = React.useRef<HTMLDivElement | null>(null)
  const animRef = React.useRef<{ stop: () => void } | null>(null)
  const symbolImagesRef = React.useRef<string[]>(symbolImages)
  symbolImagesRef.current = symbolImages

  const [strip, setStrip] = React.useState<string[]>(() => Array(STRIP_LENGTH).fill(placeholder))
  const [goldStrip, setGoldStrip] = React.useState<boolean[]>(() => Array(STRIP_LENGTH).fill(false))

  const spinTo = React.useCallback(
    (resultSymbols: string[], resultGoldCol: boolean[], onDone: () => void, snap = false) => {
      if (!stripEl.current) return
      if (animRef.current) animRef.current.stop()

      const imgs = symbolImagesRef.current.length > 0 ? symbolImagesRef.current : [placeholder]
      const tail = [...resultSymbols]
      while (tail.length < rows) tail.unshift(imgs[Math.floor(Math.random() * imgs.length)])
      const newStrip = [...buildStrip(STRIP_LENGTH - rows, imgs), ...tail]
      setStrip(newStrip)

      const goldTail = [...resultGoldCol]
      while (goldTail.length < rows) goldTail.push(false)
      setGoldStrip(buildGoldCoilStrip(STRIP_LENGTH - rows, goldTail))

      const targetY = -((newStrip.length - rows) * symbolSize)
      const duration = snap ? 0.4 : 2.4
      const ease: [number, number, number, number] = snap ? [0.2, 0, 0.1, 1] : [0.1, 0, 0.15, 1]
      const anim = animate(stripEl.current, { y: [0, targetY] }, { duration, ease })
      animRef.current = anim
      anim.then(() => {
        animRef.current = null
        onDone()
      })
    },
    [rows, symbolSize],
  )

  const setRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      stripEl.current = el
      reelRef(el ? { spinTo } : null)
    },
    [spinTo, reelRef],
  )

  const midRow = Math.floor(rows / 2)

  return (
    <div
      className="relative flex-shrink-0 overflow-hidden rounded-lg border-2 border-[var(--casino-line)] bg-black/55"
      style={{ width: symbolSize, height: symbolSize * rows }}
    >
      <div ref={setRef} style={{ willChange: 'transform' }}>
        {strip.map((imgSrc, i) => (
          <div
            key={i}
            className="flex items-center justify-center select-none"
            style={{
              width: symbolSize,
              height: symbolSize,
              background: goldStrip[i] ? 'rgba(245,158,11,0.22)' : 'transparent',
              borderBottom: goldStrip[i] ? '1px solid rgba(245,158,11,0.35)' : undefined,
            }}
          >
            <img
              src={imgSrc}
              alt=""
              draggable={false}
              className="block select-none"
              style={{ width: symbolSize * 0.7, height: symbolSize * 0.7, objectFit: 'contain' }}
            />
          </div>
        ))}
      </div>

      <div
        className="absolute left-0 right-0 border border-amber-400/20 z-[2] pointer-events-none"
        style={{ top: midRow * symbolSize, height: symbolSize }}
      />
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom,rgba(0,0,0,0.5) 0%,transparent 20%,transparent 80%,rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  )
}