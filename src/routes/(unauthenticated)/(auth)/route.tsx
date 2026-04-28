import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useRedirectIfAuthenticated } from '#/hooks/useRedirectIfAuthenticated.ts'

export const Route = createFileRoute('/(unauthenticated)/(auth)')({
  component: RouteComponent,
})

function RouteComponent() {
  useRedirectIfAuthenticated()
  return <Outlet/>
}
