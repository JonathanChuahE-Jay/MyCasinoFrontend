import type { LoginType } from '#/schemas/auth/login.ts'
import type { AuthUserType } from '#/types/auth/index.ts'

export interface LoginResponseType extends Pick<LoginType, 'phone_number'> {
  access: string
  refresh: string
  user: AuthUserType
}
