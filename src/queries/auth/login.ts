import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { KY } from '#/lib/KY.ts'
import { handleApiError } from '#/lib/handle-api-error.ts'
import type { LoginType } from '#/schemas/auth/login.ts'
import type { LoginResponseType } from '#/types/auth/login.ts'
import { useAuthStore } from '#/store/useAuthStore.ts'

export function useLoginMutation() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation<LoginResponseType, unknown, LoginType>({
    mutationFn: (data) => KY.post('login/', { json: data }).json<LoginResponseType>(),
    onSuccess: (data) => {
      setAuth(data.access, data.refresh, data.user)
      router.navigate({ to: '/' })
    },
    onError: (error) => {
      void handleApiError(error)
    },
  })
}