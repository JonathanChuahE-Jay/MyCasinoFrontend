import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { selectIsAuthenticated, useAuthStore } from '#/store/useAuthStore.ts'

export function useRedirectIfAuthenticated() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: '/', replace: true })
    }
  }, [isAuthenticated, navigate])
}