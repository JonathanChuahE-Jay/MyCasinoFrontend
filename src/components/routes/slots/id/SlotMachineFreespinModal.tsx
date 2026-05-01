import { motion } from 'motion/react'
import { Star, X } from 'lucide-react'
import { toast } from 'sonner'
import { useStartFreeSpin } from '#/queries/slots'
import type { FreespinOption, StartFreeSpinResponseType } from '#/types/slots'

interface FreespinModalProps {
  options: FreespinOption[]
  machineId: string
  onConfigured: (session: StartFreeSpinResponseType) => void
  onClose: () => void
}

export function SlotMachineFreespinModal({ options, machineId, onConfigured, onClose }: FreespinModalProps) {
  const startMutation = useStartFreeSpin(machineId)

  async function handleSelect(idx: number) {
    try {
      const session = await startMutation.mutateAsync({ option_index: idx })
      toast.success('Free spins configured! Auto-spinning now.')
      onConfigured(session)
    } catch {
      toast.error('Failed to configure free spins')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/[0.82] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="casino-card rounded-[1.25rem] p-6 max-w-[400px] w-full"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-2">
            <Star size={32} className="text-amber-400 mt-1" />

            <div className="flex flex-col">
              <div className="display-title text-lg font-black">
                Free Spins Triggered!
              </div>
              <p className="text-[var(--casino-text-soft)] text-[0.82rem]">
                Choose your free spin package
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="bg-transparent border-none text-[var(--casino-text-mute)] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {options.map((opt) => (
            <button
              key={opt.index}
              onClick={() => handleSelect(opt.index)}
              disabled={startMutation.isPending}
              className="p-[0.9rem_1rem] rounded-[0.625rem] border border-[var(--casino-line)] bg-white/[0.03] text-[var(--casino-text)] cursor-pointer flex justify-between items-center text-left disabled:opacity-50"
            >
              <div>
                <div className="font-bold text-[0.95rem]">
                  {opt.free_spins} Free Spins
                </div>
                <div className="text-[0.78rem] text-[var(--casino-text-mute)] mt-0.5">
                  ×{opt.wild_card_multiplier.join('/')} wildcard multiplier
                </div>
              </div>
              <span className="px-[0.6rem] py-[0.2rem] rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[0.72rem] font-bold">
                Option {opt.index + 1}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}