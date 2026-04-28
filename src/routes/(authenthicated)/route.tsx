import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '#/store/useAuthStore.ts'

export const Route = createFileRoute('/(authenthicated)')({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet/>
}
