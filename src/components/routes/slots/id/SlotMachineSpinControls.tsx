import { Coins, Zap } from 'lucide-react'
import type {
  CreditPerSpinOptionType,
  WildcardColOptionType,
} from '#/schemas/slots/slot-machine-schema'
import { cn } from '#/lib/utils.ts'

interface SpinControlsProps {
  creditOptions: CreditPerSpinOptionType[]
  wildcardOptions: WildcardColOptionType[]
  selectedCredit: number | null
  selectedWildcard: number | null
  onCreditChange: (credit: number) => void
  onWildcardChange: (cost: number | null) => void
}

export function SlotMachineSpinControls({
  creditOptions,
  wildcardOptions,
  selectedCredit,
  selectedWildcard,
  onCreditChange,
  onWildcardChange,
}: SpinControlsProps) {
  const activeCreditValue = selectedCredit ?? creditOptions[0]?.credit_per_spin

  return (
    <>
      <div className="casino-card p-4 rounded-[0.875rem]">
        <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--casino-text-mute)] mb-2 flex items-center gap-1.5">
          <Coins size={11} /> Bet Amount
        </div>
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(90px,1fr))' }}
        >
          {creditOptions.map((opt) => {
            const active = opt.credit_per_spin === activeCreditValue
            return (
              <button
                key={opt.credit_per_spin}
                onClick={() => onCreditChange(opt.credit_per_spin)}
                className={cn(
                  `py-[0.55rem] px-2 rounded-md text-[0.82rem] cursor-pointer text-center transition-colors`,
                  active
                    ? 'border border-amber-400/60 bg-amber-400/10 text-[var(--casino-gold)] font-bold'
                    : 'border border-[var(--casino-line-soft)] bg-white/[0.03] text-[var(--casino-text-soft)] font-normal',
                )}
              >
                <div>{opt.credit_per_spin}</div>
                <div className="text-[0.68rem] opacity-70">
                  ×{opt.default_multiplier}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {wildcardOptions.length > 0 && (
        <div className="casino-card p-4 rounded-[0.875rem]">
          <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--casino-text-mute)] mb-2 flex items-center gap-1.5">
            <Zap size={11} /> Wildcard Boost
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => onWildcardChange(null)}
              className={cn(
                `py-[0.55rem] px-3 rounded-md text-[0.82rem] cursor-pointer text-left transition-colors`,
                selectedWildcard === null
                  ? 'border border-red-500/50 bg-red-500/[0.08] text-[var(--casino-red-bright)] font-bold'
                  : 'border border-[var(--casino-line-soft)] bg-white/[0.03] text-[var(--casino-text-mute)] font-normal',
              )}
            >
              None
            </button>
            {wildcardOptions.map((wc) => {
              const active = selectedWildcard === wc.credit_cost
              return (
                <button
                  key={wc.cols_from_right}
                  onClick={() => onWildcardChange(wc.credit_cost)}
                  className={cn(
                    `py-[0.55rem] px-3 rounded-md text-[0.82rem] cursor-pointer flex justify-between items-center transition-colors`,
                    active
                      ? 'border border-amber-400/50 bg-amber-400/[0.08] text-[var(--casino-gold)] font-bold'
                      : 'border border-[var(--casino-line-soft)] bg-white/[0.03] text-[var(--casino-text-soft)] font-normal',
                  )}
                >
                  <span>
                    {wc.cols_from_right} col{wc.cols_from_right > 1 ? 's' : ''}{' '}
                    wildcard
                  </span>
                  <span
                    className={cn(
                      `text-[0.75rem]`,
                      active
                        ? 'text-[var(--casino-gold)]'
                        : 'text-[var(--casino-text-mute)]',
                    )}
                  >
                    +{wc.credit_cost} cr
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
