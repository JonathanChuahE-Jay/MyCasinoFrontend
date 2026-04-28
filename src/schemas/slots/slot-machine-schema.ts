import { z } from 'zod/v4'
import { createSlotSymbolSchema } from '#/schemas/slots/slot-symbol-schema.ts'
import { slotJackpotSchema } from '#/schemas/slots/slot-jackpot-schema.ts'


export const creditPerSpinOptionSchema = z.object({
  credit_per_spin: z.number(),
  default_multiplier: z.number(),
})

export const wildcardColOptionSchema = z.object({
  cols_from_right: z.number().int(),
  credit_cost: z.number(),
  winrate: z.number(),
})

export const jackpotPickerColProbabilitySchema = z.object({
  full_gold_cols: z.number().int(),
  probability_top_jackpot: z.number(),
})

export const freeSpinOptionSchema = z.object({
  index: z.number().int(),
  free_spins: z.number().int().min(1),
  wild_card_multiplier: z.array(z.number().int().min(1)),
})

export const freeSpinTierSchema = z.object({
  scatter_hits: z.number().int().min(1),
  options: z.array(freeSpinOptionSchema),
})

export const slotMachineSchema = z.object({
  name: z.string().max(100),
  image: z.string().nullable().optional(),
  cols: z.number().int().min(1),
  rows: z.number().int().min(1),
  total_winrate: z.number().int().min(1),
  points_per_spin: z.string(),
  credits_per_spin: z.array(creditPerSpinOptionSchema),
  wildcard_col_options: z.array(wildcardColOptionSchema),
  jackpot_picker_min_rows: z.number().int().min(1),
  jackpot_picker_col_probability: z.array(jackpotPickerColProbabilitySchema),
  gold_background_occurrence_probability: z.string(),
  free_spins: z.array(freeSpinTierSchema),
  free_spins_on_free_spin: z.record(z.string(), z.number().int()).nullable().optional(),
  col_match_allow_diagonal: z.boolean(),
  extend_chance: z.string(),
  wildcard_assist_chance: z.string(),
  free_spin_assist_chance: z.string(),
  free_spin_stack_winrate: z.string(),
  break_accidental_win_attempts: z.number().int().min(0),
})

export const slotMachineFullCreateSchema = z.object({
  machine: slotMachineSchema,
  symbols: z.array(createSlotSymbolSchema.omit({ machine: true })).optional().default([]),
  jackpots: z.array(slotJackpotSchema.omit({ machine: true })).optional().default([]),
})

export type SlotMachineFullCreateType = z.infer<typeof slotMachineFullCreateSchema>

export type CreditPerSpinOptionType = z.infer<typeof creditPerSpinOptionSchema>
export type WildcardColOptionType = z.infer<typeof wildcardColOptionSchema>
export type FreeSpinOptionType = z.infer<typeof freeSpinOptionSchema>
export type SlotMachineType = z.infer<typeof slotMachineSchema>
export type FreeSpinTierType = z.infer<typeof freeSpinTierSchema>
export type JackpotPickerColProbabilityType = z.infer<typeof jackpotPickerColProbabilitySchema>
