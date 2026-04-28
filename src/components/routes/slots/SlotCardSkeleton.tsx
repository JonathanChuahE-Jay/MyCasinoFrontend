import { Card, CardContent, CardHeader } from '#/components/ui/card.tsx'
import { Skeleton } from '#/components/ui/skeleton.tsx'

const SlotCardSkeleton = () => {
  return (
    <Card className="casino-card overflow-hidden border-white/10">
      <CardHeader className="p-0 border-b overflow-hidden">
        <div className="w-full aspect-[5/3]">
          <Skeleton className="w-full h-full bg-white/10" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4">
        <Skeleton className="h-5 w-2/3 bg-white/10" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16 bg-white/10" />
          <Skeleton className="h-4 w-20 bg-white/10" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="h-4 w-16 bg-white/10" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-12 rounded-full bg-white/10" />
          ))}
        </div>
        <Skeleton className="mt-1 h-9 w-full rounded-lg bg-white/10" />
      </CardContent>
    </Card>
  )
}

export default SlotCardSkeleton
