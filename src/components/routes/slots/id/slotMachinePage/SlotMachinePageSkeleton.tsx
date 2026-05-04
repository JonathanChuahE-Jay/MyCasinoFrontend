import { Skeleton } from '#/components/ui/skeleton'

export function SlotMachinePageSkeleton() {
  return (
    <div className="min-h-[calc(100vh-3.75rem)] py-5 pb-8">
      <div className="page-wrap">
        <Skeleton className="mb-4 h-4 w-28" />

        <div className="slot-layout">
          <div className="casino-card overflow-hidden rounded-2xl">
            <div className="flex items-center gap-3 border-b border-white/5 p-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-1.5 h-3 w-56" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            <div className="flex flex-col items-center gap-5 px-4 py-6">
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, c) => (
                  <div key={c} className="flex flex-col gap-1.5">
                    {Array.from({ length: 3 }).map((_, r) => (
                      <Skeleton key={r} className="h-16 w-16 rounded-md" />
                    ))}
                  </div>
                ))}
              </div>
              <Skeleton className="h-12 w-44 rounded-full" />
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
