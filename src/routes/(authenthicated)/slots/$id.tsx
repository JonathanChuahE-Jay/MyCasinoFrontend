import { createFileRoute, Link } from '@tanstack/react-router'
import { AnimatePresence } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { useSlotMachine } from '#/hooks/routes/slots/id/useSlotMachine.tsx'
import { SlotMachineReel } from '#/components/routes/slots/id/SlotMachineReel.tsx'
import { SlotMachineSpinControls } from '#/components/routes/slots/id/SlotMachineSpinControls.tsx'
import { SlotMachineSpinResult } from '#/components/routes/slots/id/SlotMachineSpinResult.tsx'
import { SlotMachineFreespinModal } from '#/components/routes/slots/id/SlotMachineFreespinModal.tsx'
import { SlotMachineJackpotModal } from '#/components/routes/slots/id/SlotMachineJackpotModal.tsx'
import SlotMachineHeader from '#/components/routes/slots/id/slotMachinePage/SlotMachineHeader.tsx'
import SlotMachineWinBanner from '#/components/routes/slots/id/slotMachinePage/SlotMachineWinBanner.tsx'
import SlotMachineSpinButton from '#/components/routes/slots/id/slotMachinePage/SlotMachineSpinButton.tsx'

export const Route = createFileRoute('/(authenthicated)/slots/$id')({
  component: SlotMachinePage,
})

function SlotMachinePage() {
  const { id } = Route.useParams()

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

  if (isLoading) {
    // todo: create skeleton
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.75rem)]">
        <span className="text-[var(--casino-text-mute)]">Loading…</span>
      </div>
    )
  }

  if (!machine) {
    // todo: create not found
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.75rem)]">
        <span className="text-[var(--casino-text-mute)]">
          Machine not found.
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.75rem)] py-5 pb-8">
      <div className="page-wrap">
        <Link
          to="/slots"
          className="inline-flex items-center gap-1.5 text-[var(--casino-text-soft)] no-underline text-[0.83rem] mb-4"
        >
          <ArrowLeft size={14} /> Back to Slots
        </Link>

        <div className="slot-layout">
          <div className="casino-card rounded-2xl overflow-hidden">
            <SlotMachineHeader machine={machine} />
            <div className="flex flex-col items-center gap-5 px-4 py-6">
              <div className="flex gap-1.5 overflow-x-auto py-1 max-w-full">
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
              <SlotMachineSpinButton
                handleSpin={handleSpin}
                spinning={spinning}
                isAutoSpinning={isAutoSpinning}
                freeSpinsRemaining={freeSpinsRemaining}
              />
            </div>

            <SlotMachineWinBanner result={result} showResult={showResult} />
          </div>

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
