import { createQuerySet } from '#/lib/createQuerySet'
import { userQuerySet } from '#/queries/accounts/user'
import type { CreditTopupResponseType } from '#/types/transactions'
import type { PaginatedResponse } from '#/types/common'

interface TopUpPayload {
  credits_purchased: string
  amount_paid: string
  payment_reference?: string
}

export const creditTopupQuerySet = createQuerySet<
  CreditTopupResponseType,
  CreditTopupResponseType,
  TopUpPayload
>({
  resource: 'credit-topup',
})

export const useMyTransactions = () =>
  creditTopupQuerySet.useListAction<PaginatedResponse<CreditTopupResponseType>>(
    'me',
  )

export const useTopUp = () => creditTopupQuerySet.useCreate()

interface ChangePasswordPayload {
  current_password: string
  new_password: string
  confirm_password: string
}

export const useChangePassword = () =>
  userQuerySet.useCollectionAction<ChangePasswordPayload, { detail: string }>(
    'change-password',
  )
