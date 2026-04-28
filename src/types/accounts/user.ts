import type { UserType } from '#/schemas/accounts/user-schema.ts'

export interface UserResponseType extends UserType {
  id: string;
  is_superuser: boolean;
  last_login: string;
  full_name: string;
}