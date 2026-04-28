import type { SlotSpinHistoryType } from '#/schemas/slots/slot-spin-history-schema.ts'

export interface SlotSpinHistoryResponseType extends SlotSpinHistoryType {
  id: string
  created_at: string
}
