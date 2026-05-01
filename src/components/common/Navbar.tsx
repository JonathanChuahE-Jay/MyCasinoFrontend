import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Coins, LogOut, Menu, X } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '#/store/useAuthStore.ts'
import { Button } from '#/components/ui/button.tsx'
import { useMeQuery } from '#/queries/accounts/user.ts'
import logo from '#/assets/common/logo.png'

export function Navbar() {
  const { data: user } = useMeQuery()
  const navigate = useNavigate()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const [isOpen, setIsOpen] = React.useState(false)

  const handleLogout = () => {
    clearAuth()
    toast.success('Logged out')
    navigate({ to: '/login' }).then(() => setIsOpen(false))
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-red-500/20 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-[3.75rem] w-[min(1080px,calc(100%-2rem))] items-center gap-6">
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="mr-auto flex items-center gap-2 no-underline"
        >
          <img
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-red-700 to-red-900 shadow-[0_0_20px_rgba(220,38,38,0.6)]"
            alt="logo"
            src={logo}
          />

          <span className="text-[1.1rem] font-bold tracking-wide text-white">
            MyCasino
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink to="/" exact>
            Home
          </NavLink>
          <NavLink to="/slots">Slots</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
              <Coins size={13} />
              {parseFloat(user.credits).toFixed(2)}
            </div>
          )}

          <Button onClick={handleLogout}>
            <LogOut size={13} />
            Logout
          </Button>
        </div>

        <button
          onClick={() => setIsOpen((v) => !v)}
          className="md:hidden p-2 text-white"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/90 p-4 flex flex-col gap-1">
          {user && (
            <div className="mb-2 flex items-center gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm font-semibold text-yellow-400">
              <Coins size={14} />
              {parseFloat(user.credits).toFixed(2)} credits
            </div>
          )}

          <MobileLink to="/" exact onClick={() => setIsOpen(false)}>
            Home
          </MobileLink>
          <MobileLink to="/slots" onClick={() => setIsOpen(false)}>
            Slots
          </MobileLink>
          <MobileLink to="/profile" onClick={() => setIsOpen(false)}>
            Profile
          </MobileLink>

          <Button onClick={handleLogout}>
            <LogOut size={14} />
            Logout
          </Button>
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, children, exact }: any) {
  return (
    <Link
      to={to}
      activeOptions={exact ? { exact: true } : undefined}
      className="relative text-gray-400 hover:text-white transition"
      activeProps={{
        className: 'relative text-white after:scale-x-100 after:origin-left',
      }}
    >
      {children}
      <span className="pointer-events-none absolute left-0 -bottom-2 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-red-500 to-yellow-400 transition-transform duration-200 group-hover:scale-x-100" />
    </Link>
  )
}

function MobileLink({ to, children, onClick, exact }: any) {
  return (
    <Link
      to={to}
      onClick={onClick}
      activeOptions={exact ? { exact: true } : undefined}
      className="block rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-red-500/10 hover:text-white transition"
      activeProps={{
        className:
          'block rounded-md px-3 py-2 text-sm bg-red-500/10 text-white',
      }}
    >
      {children}
    </Link>
  )
}
