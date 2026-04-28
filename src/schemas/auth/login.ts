import { z } from 'zod/v4'

export const loginSchema = z.object({
  phone_number: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d+$/, 'Phone number must contain digits only'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginType = z.infer<typeof loginSchema>
