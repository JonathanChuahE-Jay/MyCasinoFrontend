import { Card, CardContent, CardHeader } from '#/components/ui/card.tsx'
import { Grid3x3, Zap } from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import { Link } from '@tanstack/react-router'
import React from 'react'
import placeholder from '#/assets/common/slot-machine.png'
import type { SlotMachineResponseType } from '#/types/slots/slotMachine.ts'
import type { CreditPerSpinOptionType } from '#/schemas/slots/slot-machine-schema.ts'

interface SlotMachineCardProps {
  machine: SlotMachineResponseType
  minCredit: number
  maxCredit: number
  callbackfn: (opt: CreditPerSpinOptionType) => React.ReactNode
}

const SlotMachineCard = ({
  callbackfn,
  machine,
  minCredit,
  maxCredit,
}: SlotMachineCardProps) => {
  return (
    <Card className="casino-card overflow-hidden border-white/10">
      <CardHeader className="p-0 border-b overflow-hidden">
        <div className="w-full aspect-[5/3]">
          <img
            className="w-full h-full object-cover"
            src={machine.image || placeholder}
            alt={machine.name}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4">
        <h1 className="display-title text-base font-bold text-foreground">
          {machine.name}
        </h1>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Grid3x3 size={12} /> Grid
          </span>
          <span className="font-semibold text-foreground/80">
            {machine.cols} cols × {machine.rows} rows
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Zap size={12} /> Credits/Spin
          </span>
          <span className="font-semibold text-yellow-400">
            {minCredit === maxCredit
              ? `${minCredit}`
              : `${minCredit} – ${maxCredit}`}
          </span>
        </div>

        {machine.credits_per_spin.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {machine.credits_per_spin.map(callbackfn)}
          </div>
        )}

        <Button
          asChild
          className="mt-1 w-full bg-gradient-to-r from-red-600 to-red-800 font-bold tracking-wide shadow-[0_4px_16px_rgba(220,38,38,0.3)] hover:from-red-500 hover:to-red-700"
        >
          <Link to="/slots/$id" params={{ id: machine.id }}>
            Play Now
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default SlotMachineCard
