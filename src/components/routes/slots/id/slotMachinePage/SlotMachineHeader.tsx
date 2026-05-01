import placeholder from '#/assets/common/slot-machine.png'
import type { SlotMachineResponseType } from '#/types/slots/slotMachine.ts'

interface SlotMachineHeaderProps {
  machine: SlotMachineResponseType
}

const SlotMachineHeader = ({ machine }: SlotMachineHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-2.5 px-5 py-[0.9rem] border-b border-[var(--casino-line-soft)] justify-between">
      <img
        src={machine.image ?? placeholder}
        alt={machine.name}
        draggable={false}
        className="w-10 h-10 object-contain rounded-lg"
      />
      <div>
        <div className="display-title text-[1.05rem] font-extrabold">
          {machine.name}
        </div>
      </div>
    </div>
  )
}

export default SlotMachineHeader
