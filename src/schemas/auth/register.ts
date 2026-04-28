import { z } from 'zod/v4'
import { UserRoleEnumType } from '#/types/auth'

export const registerSchema = z
  .object({
    phone_number: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .regex(/^\d+$/, 'Phone number must contain digits only'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
    role: z.enum(UserRoleEnumType),
    referral_code: z.string().optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export type RegisterType = z.infer<typeof registerSchema>
