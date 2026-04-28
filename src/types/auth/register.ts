import type { RegisterType } from '#/schemas/auth/register.ts'

export interface RegisterResponseType
  extends Pick<RegisterType, 'phone_number' | 'role'> {
  id: string
  referral_code: string
}
