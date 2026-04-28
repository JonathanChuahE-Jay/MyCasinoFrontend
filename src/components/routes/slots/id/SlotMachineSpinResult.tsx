import { motion } from 'motion/react'
import type { PlayResult } from '#/types/slots'
import type { CreditPerSpinOptionType } from '#/schemas/slots/slot-machine-schema'
import SlotMachineRow from '#/components/routes/slots/id/SlotMachineRow.tsx'


interface SlotMachineSpinResultProps {
  result: PlayResult
  activeCreditOption: CreditPerSpinOptionType | undefined
  selectedWildcard: number | null
}

export function SlotMachineSpinResult({ result, activeCreditOption, selectedWildcard }: SlotMachineSpinResultProps) {
  const creditsWon = parseFloat(result.credits_won)
  const isWin = creditsWon > 0

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="casino-card p-4 rounded-[0.875rem]"
    >
      <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--casino-text-mute)] mb-2">
        Last Spin
      </div>
      <div className="flex flex-col gap-1.5 text-[0.82rem]">
        <SlotMachineRow label="Credits won" value={creditsWon.toFixed(2)} highlight={isWin} />
        <SlotMachineRow label="Bet" value={String(activeCreditOption?.credit_per_spin ?? '?')} />
        {selectedWildcard != null && <SlotMachineRow label="Wildcard" value={`+${selectedWildcard} cr`} />}
        {result.free_spin?.triggered && <SlotMachineRow label="Free Spins" value="Triggered!" gold />}
        {result.jackpot?.triggered && <SlotMachineRow label="Jackpot" value="Triggered!" gold />}
        {result.gold.consecutive_full_gold_cols > 0 && (
          <SlotMachineRow label="Gold cols" value={String(result.gold.consecutive_full_gold_cols)} gold />
        )}
      </div>
    </motion.div>
  )
}