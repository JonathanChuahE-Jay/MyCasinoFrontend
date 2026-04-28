import { z } from 'zod'
import { UserRoleEnumType } from '#/types/auth'

const userSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  referral_code: z.string().optional(),
  role: z.enum(UserRoleEnumType),
  credits: z.string().default('0.00'),
  points: z.string().default('0.00'),
  is_active: z.boolean().default(true),
  is_staff: z.boolean().default(false),
})

export type UserType = z.infer<typeof userSchema>

