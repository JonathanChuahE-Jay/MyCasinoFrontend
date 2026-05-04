import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore, selectIsAuthenticated, selectIsHydrated } from '#/store/useAuthStore'

export const Route = createFileRoute('/(unauthenticated)')({
  beforeLoad: () => {
    if (typeof document === 'undefined') return
    const hasCookie = document.cookie
      .split('; ')
      .some((c) => c.startsWith('mc_access='))
    if (hasCookie) throw redirect({ to: '/', replace: true })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const isHydrated = useAuthStore(selectIsHydrated)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      void navigate({ to: '/', replace: true })
    }
  }, [isHydrated, isAuthenticated, navigate])

  if (!isHydrated) return null
  return <Outlet />
}
