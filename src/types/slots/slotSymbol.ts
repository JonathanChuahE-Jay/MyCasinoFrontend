import type { SlotSymbolType } from '#/schemas/slots/slot-symbol-schema.ts'

export interface SlotSymbolResponseType extends SlotSymbolType {
  id: string
  created_at: string
  updated_at: string | null
}
