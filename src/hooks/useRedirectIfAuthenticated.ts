import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { selectIsAuthenticated, selectIsHydrated, useAuthStore } from '#/store/useAuthStore.ts'

export function useRedirectIfAuthenticated() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isHydrated = useAuthStore(selectIsHydrated)

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      void navigate({ to: '/', replace: true })
    }
  }, [isHydrated, isAuthenticated, navigate])
}