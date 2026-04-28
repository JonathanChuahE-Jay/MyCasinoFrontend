import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Trophy } from 'lucide-react'
import type { SlotJackpotResponseType } from '#/types/slots/slotJackpot'
import placeholder from '#/assets/common/slot-machine.png'
import { SlotMachineFlipCard } from '#/components/routes/slots/id/SlotMachineFlipCard.tsx'

export interface JackpotSession {
  reveal_sequence: string[]
  winner_position: number
  winner_jackpot_id: string
  session_id: string
}

interface JackpotModalProps {
  session: JackpotSession
  jackpots: SlotJackpotResponseType[]
  onClose: () => void
}

const CARD_COLORS = ['#ef4444','#3b82f6','#10b981','#8b5cf6','#f59e0b','#ec4899','#06b6d4']

function jackpotColor(id: string, allIds: string[]): string {
  const idx = [...new Set(allIds)].indexOf(id)
  return CARD_COLORS[Math.max(idx, 0) % CARD_COLORS.length]
}

export function SlotMachineJackpotModal({ session, jackpots, onClose }: JackpotModalProps) {
  const { reveal_sequence, winner_jackpot_id } = session

  const [revealedMap, setRevealedMap] = useState<Record<number, number>>({})
  const [nextSeqPos, setNextSeqPos] = useState(0)

  const jackpotImgMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const j of jackpots) map.set(j.id, j.image ?? placeholder)
    return map
  }, [jackpots])

  const revealedCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const seqPos of Object.values(revealedMap)) {
      const id = reveal_sequence[seqPos]
      counts[id] = (counts[id] ?? 0) + 1
    }
    return counts
  }, [revealedMap, reveal_sequence])

  const revealedWinnerCount = revealedCounts[winner_jackpot_id] ?? 0
  const hasWon = revealedWinnerCount >= 3
  const totalCards = reveal_sequence.length

  function handleCardClick(cardIdx: number) {
    if (revealedMap[cardIdx] !== undefined) return
    if (hasWon) return
    if (nextSeqPos >= totalCards) return

    let chosenSeqPos = -1
    let newNextSeqPos = nextSeqPos

    for (let scan = nextSeqPos; scan < totalCards; scan++) {
      const scanId = reveal_sequence[scan]
      const scanCount = revealedCounts[scanId] ?? 0
      const isWinner = scanId === winner_jackpot_id
      if (isWinner || scanCount < 2) {
        chosenSeqPos = scan
        newNextSeqPos = scan + 1
        break
      }
    }

    if (chosenSeqPos === -1) return

    setRevealedMap((prev) => ({ ...prev, [cardIdx]: chosenSeqPos }))
    setNextSeqPos(newNextSeqPos)
  }

  const remaining = hasWon ? 0 : totalCards - nextSeqPos
  const winnerJackpot = jackpots.find((j) => j.id === winner_jackpot_id)

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        className="casino-card rounded-2xl p-6 max-w-[420px] w-full text-center"
      >
        <Trophy className="mb-1 text-amber-400 inline-block" size={38} />
        <div className="display-title text-xl font-black mb-0.5">Jackpot Picker!</div>
        <p className="text-[var(--casino-text-soft)] text-xs mb-4">
          {hasWon
            ? `You won the ${winnerJackpot?.name ?? 'Jackpot'}!`
            : `Match 3 to win — ${remaining} card${remaining !== 1 ? 's' : ''} left`}
        </p>

        <div className="grid grid-cols-3 gap-2.5 justify-items-center mb-5">
          {Array.from({ length: totalCards }).map((_, cardIdx) => {
            const seqPos = revealedMap[cardIdx]
            const revealed = seqPos !== undefined
            const jackpotId = revealed ? reveal_sequence[seqPos] : ''
            const isWinnerCard = jackpotId === winner_jackpot_id
            const color = revealed ? jackpotColor(jackpotId, reveal_sequence) : '#555'
            const imageSrc = revealed ? (jackpotImgMap.get(jackpotId) ?? placeholder) : placeholder
            const matchHighlight = revealed && isWinnerCard && hasWon

            return (
              <SlotMachineFlipCard
                key={cardIdx}
                revealed={revealed}
                color={color}
                isWinner={isWinnerCard}
                imageSrc={imageSrc}
                onClick={() => handleCardClick(cardIdx)}
                cardSize={100}
                disabled={hasWon || revealed}
                matchHighlight={matchHighlight}
              />
            )
          })}
        </div>

        <AnimatePresence>
          {hasWon && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-400/10 border border-amber-400/45 text-amber-400 font-bold text-[0.95rem]">
                <Trophy size={15} /> {winnerJackpot?.name ?? 'Jackpot'} won!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {hasWon && (
          <button
            onClick={onClose}
            className="px-10 py-2.5 rounded-xl border-none bg-gradient-to-br from-[var(--casino-red)] to-red-700 text-white cursor-pointer text-[0.9rem] font-bold tracking-wide shadow-[0_0_20px_rgba(220,38,38,0.4)] uppercase"
          >
            Claim &amp; Close
          </button>
        )}
      </motion.div>
    </div>
  )
}