import { z } from 'zod/v4'

export const slotJackpotSchema = z.object({
  machine: z.uuid(),
  name: z.string().max(50),
  seed_value: z.string(),
  current_value: z.string(),
  contribution_rate: z.string(),
  win_rate: z.string(),
  image: z.string().nullable().optional(),
  fallback_jackpot: z.boolean(),
})


export type SlotJackpotType = z.infer<typeof slotJackpotSchema>
