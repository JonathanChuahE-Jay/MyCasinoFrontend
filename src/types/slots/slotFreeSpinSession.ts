import type { SlotFreeSpinSessionType } from '#/schemas/slots/slot-free-spin-session-schema.ts'

export interface SlotFreeSpinSessionResponseType extends Omit<SlotFreeSpinSessionType, 'user'> {
  id: number;
  created_at: string;
  user: string;
}

export interface StartFreeSpinResponseType extends SlotFreeSpinSessionResponseType {}