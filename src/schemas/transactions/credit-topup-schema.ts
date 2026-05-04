import { z } from 'zod'

export const creditTopupSchema = z.object({
  id: z.string(),
  credits_purchased: z.string(),
  amount_paid: z.string(),
  payment_reference: z.string().nullable().optional(),
  credits_before: z.string(),
  credits_after: z.string(),
  created_at: z.string(),
})

export type CreditTopupType = z.infer<typeof creditTopupSchema>
