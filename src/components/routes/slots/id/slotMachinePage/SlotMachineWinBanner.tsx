import { AnimatePresence, motion } from 'motion/react'
import { Trophy } from 'lucide-react'
import type { SlotPlayResponseType } from '#/types/slots/slotPlay.ts'

interface SlotMachineWinBannerProps {
  showResult: boolean;
  result: SlotPlayResponseType | null;
}

const SlotMachineWinBanner = ({
  showResult,
  result,
}: SlotMachineWinBannerProps) => {

  const creditsWon = result ? parseFloat(result.credits_won) : 0
  const isWin = creditsWon > 0

  return (
    <AnimatePresence>
      {showResult && result && (
        <motion.div
          key="banner"
          initial={{ opacity: 0, scale: 0.85, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className={[
            'flex items-center gap-2 px-6 py-1 rounded-full text-[0.95rem] font-bold border',
            isWin
              ? 'bg-green-500/10 border-green-500/40 text-green-400'
              : 'bg-red-600/8 border-red-600/25 text-[var(--casino-red-bright)]',
          ].join(' ')}
        >
          {isWin ? (
            <>
              <Trophy size={15} /> +{creditsWon.toFixed(2)} credits!
            </>
          ) : (
            <>No win — try again!</>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SlotMachineWinBanner
