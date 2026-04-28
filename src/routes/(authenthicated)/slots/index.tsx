import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { slotMachineQuerySet } from '#/queries/slots'
import { Card } from '#/components/ui/card.tsx'
import { Badge } from '#/components/ui/badge.tsx'
import SlotCardSkeleton from '#/components/routes/slots/SlotCardSkeleton.tsx'
import SlotMachineHeader from '#/components/routes/slots/SlotMachineHeader.tsx'
import SlotMachineCard from '#/components/routes/slots/SlotMachineCard.tsx'

export const Route = createFileRoute('/(authenthicated)/slots/')({
  component: SlotsPage,
})

function SlotsPage() {
  const { data, isLoading, isError } = useQuery(
    slotMachineQuerySet.listOptions(),
  )
  const machines = data?.results ?? []

  return (
    <section className="min-h-[calc(100vh-3.75rem)] py-10">
      <div className="page-wrap">
        <SlotMachineHeader />

        {!isLoading && !isError && machines.length === 0 && (
          <Card className="border-white/10 bg-white/5 py-12 text-center text-muted-foreground">
            No slot machines available yet.
          </Card>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SlotCardSkeleton key={i} />
              ))
            : machines.map((machine) => {
                const minCredit = machine.credits_per_spin[0]?.credit_per_spin ?? 0
                const maxCredit = machine.credits_per_spin[machine.credits_per_spin.length - 1] ?.credit_per_spin ?? 0

                return (
                  <SlotMachineCard
                    key={machine.id}
                    machine={machine}
                    minCredit={minCredit}
                    maxCredit={maxCredit}
                    callbackfn={(opt) => (
                      <Badge
                        key={opt.credit_per_spin}
                        variant="outline"
                        className="border-yellow-500/25 bg-yellow-500/10 text-[0.7rem] text-yellow-400"
                      >
                        {opt.credit_per_spin}×{opt.default_multiplier}
                      </Badge>
                    )}
                  />
                )
              })}
        </div>
      </div>
    </section>
  )
}
