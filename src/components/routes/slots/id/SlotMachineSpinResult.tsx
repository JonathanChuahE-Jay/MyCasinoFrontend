import { motion } from 'motion/react'
import type { PlayResult, SlotSpinCalculationEntry } from '#/types/slots'
import type { CreditPerSpinOptionType } from '#/schemas/slots/slot-machine-schema'
import SlotMachineRow from '#/components/routes/slots/id/SlotMachineRow.tsx'

interface SlotMachineSpinResultProps {
  result: PlayResult
  activeCreditOption: CreditPerSpinOptionType | undefined
  selectedWildcard: number | null
}

function CalcEntry({ entry }: { entry: SlotSpinCalculationEntry }) {
  const base = parseFloat(entry.initial_credit_won)
  const extra = parseFloat(entry.extra_symbol_won) * entry.surplus
  const bet = parseFloat(entry.bet_multiplier)
  const wc = entry.wildcard_multiplier
  const won = parseFloat(entry.credits_won)

  const formula = wc
    ? `(${base.toFixed(2)} + ${extra.toFixed(2)}) × ${bet} × ${wc} = ${won.toFixed(2)}`
    : `(${base.toFixed(2)} + ${extra.toFixed(2)}) × ${bet} = ${won.toFixed(2)}`

  return (
    <div className="rounded-md bg-white/[0.03] border border-[var(--casino-line-soft)] p-2.5 flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="font-bold text-[0.82rem] text-[var(--casino-text)]">{entry.symbol_name}</span>
        <span className="text-green-400 font-bold text-[0.82rem]">+{won.toFixed(2)}</span>
      </div>
      <div className="flex gap-3 text-[0.72rem] text-[var(--casino-text-mute)]">
        <span>{entry.matched_cols} cols matched</span>
        <span>{entry.total_have} cells</span>
        {entry.wildcard_involved && <span className="text-amber-400">wildcard</span>}
      </div>
      <div className="text-[0.7rem] text-[var(--casino-text-mute)] font-mono">{formula}</div>
    </div>
  )
}

export function SlotMachineSpinResult({ result, activeCreditOption, selectedWildcard }: SlotMachineSpinResultProps) {
  const creditsWon = parseFloat(result.credits_won)
  const isWin = creditsWon > 0
  const calculation = result.calculation ?? []

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

      {calculation.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="text-[0.68rem] uppercase tracking-[0.1em] text-[var(--casino-text-mute)]">
            Win Breakdown
          </div>
          {calculation.map((entry, i) => (
            <CalcEntry key={i} entry={entry} />
          ))}
        </div>
      )}
    </motion.div>
  )
}