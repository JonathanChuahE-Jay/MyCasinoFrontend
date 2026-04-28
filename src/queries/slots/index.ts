import { createQuerySet } from '#/lib/createQuerySet'
import { useQuery } from '@tanstack/react-query'
import { KY } from '#/lib/KY.ts'
import type { SlotPlayResponseType } from '#/types/slots/slotPlay.ts'
import type { SlotPlayType } from '#/schemas/slots/slot-play-schema.ts'
import type { SlotMachineResponseType } from '#/types/slots/slotMachine.ts'
import type { StartFreeSpinType } from '#/schemas/slots/slot-free-spin-session-schema.ts'
import type { StartFreeSpinResponseType } from '#/types/slots/slotFreeSpinSession.ts'
import type { SlotSymbolResponseType } from '#/types/slots/slotSymbol.ts'
import type { SlotJackpotResponseType } from '#/types/slots/slotJackpot.ts'
import type { PaginatedResponse } from '#/types/common.ts'

export const slotMachineQuerySet = createQuerySet<SlotMachineResponseType>({
  resource: 'slot-machines',
})

export const usePlaySlot = () => slotMachineQuerySet.useAction<SlotPlayType, SlotPlayResponseType>('play')

export function useStartFreeSpin(machineId: string) {
  const mutation = slotMachineQuerySet.useAction<
    StartFreeSpinType,
    StartFreeSpinResponseType
  >('start-free-spin')
  return {
    mutateAsync: (data: StartFreeSpinType) =>
      mutation.mutateAsync({ id: machineId, data }),
    isPending: mutation.isPending,
  }
}

export function useSlotMachineSymbols(machineId: string) {
  return useQuery({
    queryKey: ['slot-machines', 'symbols', machineId],
    queryFn: () =>
      KY.get(`slot-machines/${machineId}/symbols/`).json<
        PaginatedResponse<SlotSymbolResponseType>
      >(),
  })
}

export function useSlotMachineJackpots(machineId: string) {
  return useQuery({
    queryKey: ['slot-machines', 'jackpots', machineId],
    queryFn: () =>
      KY.get(`slot-machines/${machineId}/jackpots/`).json<
        PaginatedResponse<SlotJackpotResponseType>
      >(),
  })
}
