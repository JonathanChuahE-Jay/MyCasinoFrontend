import { create } from 'zustand'
import type { AuthUserType } from '#/types/auth'

const ACCESS_COOKIE = 'mc_access'
const REFRESH_COOKIE = 'mc_refresh'
const USER_COOKIE = 'mc_user'

function setCookie(name: string, value: string, maxAgeDays: number): void {
  if (typeof document === 'undefined') return
  const maxAge = maxAgeDays * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)};max-age=${maxAge};path=/;SameSite=Lax`
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(';').shift()!)
  }
  return null
}

function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=;max-age=0;path=/`
}

function parseUserCookie(): AuthUserType | null {
  const raw = getCookie(USER_COOKIE)
  if (!raw) return null
  try { return JSON.parse(raw) as AuthUserType } catch { return null }
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUserType | null
  isAuthenticated: boolean
}

interface AuthActions {
  setAuth: (access: string, refresh: string, user: AuthUserType) => void
  clearAuth: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: getCookie(ACCESS_COOKIE),
  refreshToken: getCookie(REFRESH_COOKIE),
  user: parseUserCookie(),
  isAuthenticated: !!getCookie(ACCESS_COOKIE),

  setAuth: (access, refresh, user) => {
    setCookie(ACCESS_COOKIE, access, 1)
    setCookie(REFRESH_COOKIE, refresh, 3)
    setCookie(USER_COOKIE, JSON.stringify(user), 3)
    set({ accessToken: access, refreshToken: refresh, user, isAuthenticated: true })
  },

  clearAuth: () => {
    deleteCookie(ACCESS_COOKIE)
    deleteCookie(REFRESH_COOKIE)
    deleteCookie(USER_COOKIE)
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false })
  },

  hydrate: () => {
    set({
      accessToken: getCookie(ACCESS_COOKIE),
      refreshToken: getCookie(REFRESH_COOKIE),
      user: parseUserCookie(),
      isAuthenticated: !!getCookie(ACCESS_COOKIE),
    })
  },
}))

// Selector helpers — use these to avoid inline selectors recreating on every render
export const selectUser = (s: AuthState & AuthActions) => s.user
export const selectIsAuthenticated = (s: AuthState & AuthActions) => s.isAuthenticated
export const selectAccessToken = (s: AuthState & AuthActions) => s.accessToken
export const selectRefreshToken = (s: AuthState & AuthActions) => s.refreshToken