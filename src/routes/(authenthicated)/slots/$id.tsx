import { createFileRoute, Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Coins, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSlotMachine } from '#/hooks/routes/slots/id/useSlotMachine.tsx'
import { SlotMachineReel } from '#/components/routes/slots/id/SlotMachineReel.tsx'
import { SlotMachineSpinControls } from '#/components/routes/slots/id/SlotMachineSpinControls.tsx'
import { SlotMachineSpinResult } from '#/components/routes/slots/id/SlotMachineSpinResult.tsx'
import { SlotMachineFreespinModal } from '#/components/routes/slots/id/SlotMachineFreespinModal.tsx'
import { SlotMachineJackpotModal } from '#/components/routes/slots/id/SlotMachineJackpotModal.tsx'
import SlotMachineHeader from '#/components/routes/slots/id/slotMachinePage/SlotMachineHeader.tsx'
import SlotMachineWinBanner from '#/components/routes/slots/id/slotMachinePage/SlotMachineWinBanner.tsx'
import SlotMachineSpinButton from '#/components/routes/slots/id/slotMachinePage/SlotMachineSpinButton.tsx'
import { SlotMachineWinLog, makeLogEntry, type WinLogEntry } from '#/components/routes/slots/id/slotMachinePage/SlotMachineWinLog.tsx'
import { SlotMachinePageSkeleton } from '#/components/routes/slots/id/slotMachinePage/SlotMachinePageSkeleton.tsx'
import { useMeQuery } from '#/queries/accounts/user'

export const Route = createFileRoute('/(authenthicated)/slots/$id')({
  component: SlotMachinePage,
})

function SlotMachinePage() {
  const { id } = Route.useParams()
  const { data: me } = useMeQuery()

  const {
    machine,
    isLoading,
    jackpots,
    symbolImages,
    symbolSize,
    cols,
    rows,
    creditOptions,
    wildcardOptions,
    activeCreditOption,
    spinning,
    result,
    showResult,
    freespinOptions,
    jackpotSession,
    selectedCredit,
    selectedWildcard,
    setSelectedCredit,
    setSelectedWildcard,
    reelRefs,
    handleSpin,
    startAutoSpin,
    isAutoSpinning,
    freeSpinsRemaining,
    setFreespinOptions,
    setJackpotSession,
  } = useSlotMachine(id)

  const [winLog, setWinLog] = useState<WinLogEntry[]>([])
  const lastResultRef = useRef<unknown>(null)
  const logIdRef = useRef(0)

  useEffect(() => {
    if (!result || !showResult) return
    if (lastResultRef.current === result) return
    lastResultRef.current = result
    const credit = activeCreditOption?.credit_per_spin ?? selectedCredit ?? 0
    const entry = makeLogEntry(result, credit, ++logIdRef.current)
    setWinLog((prev) => [entry, ...prev].slice(0, 25))
  }, [result, showResult, activeCreditOption, selectedCredit])

  if (isLoading) return <SlotMachinePageSkeleton />

  if (!machine) {
    return (
      <div className="flex min-h-[calc(100vh-3.75rem)] items-center justify-center">
        <div className="casino-card flex flex-col items-center gap-3 rounded-2xl px-8 py-10 text-center">
          <span className="display-title text-xl font-bold">
            Machine not found
          </span>
          <Link to="/slots" className="text-sm text-red-400 hover:underline">
            ← Back to Slots
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.75rem)] py-5 pb-8">
      <div className="page-wrap">
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/slots"
            className="inline-flex items-center gap-1.5 text-[0.83rem] text-[var(--casino-text-soft)] no-underline hover:text-white"
          >
            <ArrowLeft size={14} /> Back to Slots
          </Link>
          {me && (
            <div className="flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
              <Coins size={12} />
              {parseFloat(me.credits).toFixed(2)}
            </div>
          )}
        </div>

        <div className="slot-layout">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="casino-card relative overflow-hidden rounded-2xl"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(245,158,11,0.18),transparent_55%)]"
            />
            <SlotMachineHeader machine={machine} />
            <div className="relative flex flex-col items-center gap-5 px-4 py-6">
              <div className="absolute inset-x-6 top-3 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
                <span className="flex items-center gap-1">
                  <Sparkles size={10} className="text-yellow-400/80" /> Reels
                </span>
                <span>
                  {cols}×{rows}
                </span>
              </div>
              <div className="rounded-2xl border border-red-500/20 bg-black/40 p-3 shadow-[inset_0_0_40px_rgba(220,38,38,0.15)]">
                <div className="flex max-w-full gap-1.5 overflow-x-auto py-1">
                  {Array.from({ length: cols }).map((_, colIdx) => (
                    <SlotMachineReel
                      key={colIdx}
                      rows={rows}
                      symbolSize={symbolSize}
                      symbolImages={symbolImages}
                      reelRef={(h) => {
                        reelRefs.current[colIdx] = h
                      }}
                    />
                  ))}
                </div>
              </div>
              <SlotMachineSpinButton
                handleSpin={handleSpin}
                spinning={spinning}
                isAutoSpinning={isAutoSpinning}
                freeSpinsRemaining={freeSpinsRemaining}
              />
            </div>

            <SlotMachineWinBanner result={result} showResult={showResult} />
          </motion.div>

          <div className="flex flex-col gap-3.5">
            <SlotMachineSpinControls
              creditOptions={creditOptions}
              wildcardOptions={wildcardOptions}
              selectedCredit={selectedCredit}
              selectedWildcard={selectedWildcard}
              onCreditChange={setSelectedCredit}
              onWildcardChange={setSelectedWildcard}
            />

            <AnimatePresence>
              {result && showResult && (
                <SlotMachineSpinResult
                  result={result}
                  activeCreditOption={activeCreditOption}
                  selectedWildcard={selectedWildcard}
                />
              )}
            </AnimatePresence>

            <SlotMachineWinLog entries={winLog} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {freespinOptions && (
          <SlotMachineFreespinModal
            options={freespinOptions}
            machineId={id}
            onConfigured={(session) => {
              setFreespinOptions(null)
              startAutoSpin(session.spins_remaining ?? session.free_spins_awarded)
            }}
            onClose={() => setFreespinOptions(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {jackpotSession && (
          <SlotMachineJackpotModal
            session={jackpotSession}
            jackpots={jackpots}
            onClose={() => setJackpotSession(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
