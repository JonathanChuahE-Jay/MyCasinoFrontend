import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { KY } from '#/lib/KY.ts'
import { handleApiError } from '#/lib/handle-api-error.ts'
import type { RegisterType } from '#/schemas/auth/register.ts'
import type { RegisterResponseType } from '#/types/auth/register.ts'

export function useRegisterMutation() {
  const router = useRouter()

  return useMutation<RegisterResponseType, unknown, RegisterType>({
    mutationFn: (data) =>
      KY.post('register/', { json: data }).json<RegisterResponseType>(),
    onSuccess: () => {
      toast.success('Account created. Please sign in.')
      router.navigate({ to: '/login' })
    },
    onError: (error) => {
      void handleApiError(error)
    },
  })
}
