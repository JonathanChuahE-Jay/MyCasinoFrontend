import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Toaster } from 'sonner'
import { useEffect } from 'react'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { Navbar } from '../components/common/Navbar.tsx'
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { selectIsHydrated, useAuthStore } from '#/store/useAuthStore.ts'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'MyCasino' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

const AUTH_PATHS = ['/login', '/register']

function RootLayout() {
  const location = useRouterState({ select: (s) => s.location })
  const isAuthPage = AUTH_PATHS.some((p) => location.pathname.startsWith(p))
  const isHydrated = useAuthStore(selectIsHydrated)

  useEffect(() => {
    useAuthStore.getState().hydrate()
  }, [])

  if (!isHydrated) {
    // todo: add own loading screen
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500/20 border-t-red-500" />
          <span className="text-sm font-medium tracking-widest text-red-500/70 uppercase">
            Loading
          </span>
        </div>
      </div>
    )
  }

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Outlet />
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Toaster theme="dark" position="top-right" richColors closeButton />
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}