import { z } from 'zod/v4'

export const slotSpinHistorySchema = z.object({
  user: z.uuid(),
  machine: z.uuid(),
  free_spin_session: z.number().int().nullable(),
  grid_result: z.array(z.array(z.number().int())),
  credits_before: z.number().int(),
  credits_after: z.number().int(),
  credits_spent: z.string(),
  credits_won: z.string(),
  points_before: z.number().int(),
  points_after: z.number().int(),
  points_won: z.string(),
  bet_multiplier: z.number(),
  wildcard_cols_purchased: z.number().int().nullable(),
  wildcard_multiplier_applied: z.number().int(),
  jackpot_won: z.uuid().nullable(),
  is_free_spin: z.boolean(),
})

export type SlotSpinHistoryType = z.infer<typeof slotSpinHistorySchema>

