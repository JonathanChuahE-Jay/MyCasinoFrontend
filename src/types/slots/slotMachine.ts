import type { SlotJackpotSessionType } from '#/schemas/slots/slot-jackpot-session-schema.ts'
import type { SlotJackpotResponseType } from '#/types/slots/slotJackpot.ts'
import type { SlotSymbolResponseType } from '#/types/slots/slotSymbol.ts'
import type { SlotMachineType } from '#/schemas/slots/slot-machine-schema.ts'

export interface SlotJackpotSessionResponseType extends Omit<
  SlotJackpotSessionType,
  'user'
> {
  id: string
  created_at: string
  user: string
}

export interface SlotMachineFullCreateResponseType {
  machine: SlotMachineResponseType
  symbols: SlotSymbolResponseType[]
  jackpots: SlotJackpotResponseType[]
}

export interface SlotMachineResponseType extends SlotMachineType {
  id: string;
  created_at: string
}
