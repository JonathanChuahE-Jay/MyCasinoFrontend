import { createQuerySet } from '#/lib/createQuerySet.ts'
import type { UserResponseType } from '#/types/accounts/user.ts'
import type { UserType } from '#/schemas/accounts/user-schema.ts'

export const userQuerySet = createQuerySet<UserResponseType>({
  resource: 'users',
})

export const useMeQuery = () => userQuerySet.useListAction<UserType>('me')