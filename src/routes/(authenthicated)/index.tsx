import { createFileRoute } from '@tanstack/react-router'
import { selectUser, useAuthStore } from '#/store/useAuthStore.ts'

export const Route = createFileRoute('/(authenthicated)/')({
  component: Home,
})

function Home() {
  const user = useAuthStore(selectUser)

  return <div></div>
}
