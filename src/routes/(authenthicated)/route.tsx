import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { selectIsAuthenticated, selectIsHydrated, useAuthStore } from '#/store/useAuthStore.ts'

export const Route = createFileRoute('/(authenthicated)')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isHydrated = useAuthStore(selectIsHydrated)

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      void navigate({ to: '/login', replace: true })
    }
  }, [isHydrated, isAuthenticated, navigate])

  if (!isHydrated) return null

  return <Outlet />
}