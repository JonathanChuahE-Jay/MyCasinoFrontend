import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useRedirectIfAuthenticated } from '#/hooks/useRedirectIfAuthenticated.ts'
import { selectIsHydrated, useAuthStore } from '#/store/useAuthStore.ts'

export const Route = createFileRoute('/(unauthenticated)')({
  component: RouteComponent,
})

function RouteComponent() {
  useRedirectIfAuthenticated()
  const isHydrated = useAuthStore(selectIsHydrated)

  if (!isHydrated) return null

  return <Outlet />
}