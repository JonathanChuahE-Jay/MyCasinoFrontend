import { cn } from '#/lib/utils.ts'

interface SlotMachineRowProps {
  label: string
  value: string
  highlight?: boolean
  gold?: boolean
}

const SlotMachineRow = ({
  label,
  value,
  highlight,
  gold,
}: SlotMachineRowProps) => {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--casino-text-soft)]">{label}</span>
      <span
        className={cn(
          `font-bold`,
          gold
            ? 'text-[var(--casino-gold)]'
            : highlight
              ? 'text-green-400'
              : 'text-[var(--casino-text-soft)]',
        )}
      >
        {value}
      </span>
    </div>
  )
}

export default SlotMachineRow
