import { z } from 'zod/v4'

export const slotJackpotSessionSchema = z.object({
  user: z.uuid().optional(),
  machine: z.uuid(),
  reveal_sequence: z.array(z.uuid()),
  is_claimed: z.boolean(),
  winner_jackpot: z.null(),
  credits_awarded: z.null(),
  full_gold_cols: z.number().int(),
  claimed_at: z.iso.datetime().nullable(),
})

export type SlotJackpotSessionType = z.infer<typeof slotJackpotSessionSchema>

