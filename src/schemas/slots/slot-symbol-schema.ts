import { z } from 'zod/v4'

export const creditsOffsetTierSchema = z.object({
  initial_credit_won: z.number(),
  extra_symbol_won: z.number(),
})

export const creditsOffsetSchema = z.record(z.string(), creditsOffsetTierSchema)

export const slotSymbolSchema = z.object({
  machine: z.uuid(),
  name: z.string(),
  image: z.string().nullable().optional(),
  win_rate: z.string(),
  number_of_col_to_win: z.number().int().min(1),
  credits_offset: creditsOffsetSchema,
  is_wildcard: z.boolean(),
  is_free_spin_trigger: z.boolean(),
  appear_sound: z.union([z.instanceof(File), z.string()])
})

export type SlotSymbolType = z.infer<typeof slotSymbolSchema>

