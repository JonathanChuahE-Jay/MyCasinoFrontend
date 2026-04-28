import { z } from 'zod/v4'

export const slotPlaySchema = z.object({
  credit_per_spin: z.number(),
  wildcard_credit: z.number(),
  option_index: z.number().int().min(0).optional(),
})

export type SlotPlayType = z.infer<typeof slotPlaySchema>
