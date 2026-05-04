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
import { Footer } from '../components/common/Footer.tsx'
import { CasinoBackground } from '../components/common/CasinoBackground.tsx'
import { LoadingScreen } from '../components/common/LoadingScreen.tsx'
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
    return <LoadingScreen />
  }

  return (
    <>
      <CasinoBackground />
      {!isAuthPage && <Navbar />}
      <div className="flex min-h-[calc(100vh-3.75rem)] flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        {!isAuthPage && <Footer />}
      </div>
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