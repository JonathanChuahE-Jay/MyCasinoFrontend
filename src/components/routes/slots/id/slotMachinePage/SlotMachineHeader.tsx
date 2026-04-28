import placeholder from '#/assets/common/slot-machine.png'
import type { SlotMachineResponseType } from '#/types/slots/slotMachine.ts'
import SlotMachineWinBanner from '#/components/routes/slots/id/slotMachinePage/SlotMachineWinBanner.tsx'
import type { SlotPlayResponseType } from '#/types/slots/slotPlay.ts'

interface SlotMachineHeaderProps {
  machine: SlotMachineResponseType
  showResult: boolean
  result: SlotPlayResponseType | null
}

const SlotMachineHeader = ({
  machine,
  result,
  showResult,
}: SlotMachineHeaderProps) => {
  return (
    <div className="flex items-center gap-2.5 px-5 py-[0.9rem] border-b border-[var(--casino-line-soft)] justify-between">
      <div
        className='flex items-center'
      >
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

      <SlotMachineWinBanner result={result} showResult={showResult} />
    </div>
  )
}

export default SlotMachineHeader
