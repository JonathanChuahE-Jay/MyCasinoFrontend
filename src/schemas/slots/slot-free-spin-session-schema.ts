import { z } from 'zod/v4'

export const slotFreeSpinSessionSchema = z.object({
  user: z.uuid().optional(),
  machine: z.uuid(),
  spins_remaining: z.number().int().nullable(),
  free_spins_awarded: z.number().int(),
  wild_card_multiplier: z.array(z.number().int()).nullable(),
  is_active: z.boolean(),
  is_configured: z.boolean(),
  is_completed: z.boolean(),
  completed_at: z.iso.datetime().nullable(),
  credits_per_spin: z.string(),
  wildcard_credit: z.string(),
})

export type SlotFreeSpinSessionType = z.infer<typeof slotFreeSpinSessionSchema>

export const startFreeSpinSchema = z.object({
  option_index: z.number().int().min(0),
})

export type StartFreeSpinType = z.infer<typeof startFreeSpinSchema>
