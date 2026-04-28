import ky from 'ky'
import { env } from '#/env'
import { useAuthStore } from '#/store/useAuthStore.ts'

const BASE = env.VITE_API_URL ?? 'http://localhost:7353'

interface RefreshResponse {
  access: string
}

export const KY = ky.create({
  baseUrl: `${BASE}/api/`,
  retry: {
    limit: 1,
    methods: ['get', 'post', 'put', 'patch', 'delete'],
    statusCodes: [401],
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = useAuthStore.getState().accessToken
        if (token && !request.headers.has('Authorization')) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async ({ request, response, retryCount }) => {
        if (response.status !== 401 || retryCount > 0) return response

        const url = new URL(request.url)
        if (
          url.pathname.endsWith('/refresh/') ||
          url.pathname.endsWith('/login/') ||
          url.pathname.endsWith('/register/')
        ) {
          return response
        }

        const { refreshToken, user, setAuth, clearAuth } = useAuthStore.getState()
        if (!refreshToken || !user) return response

        try {
          const refreshed = await ky
            .post(`${BASE}/api/refresh/`, { json: { refresh: refreshToken } })
            .json<RefreshResponse>()

          setAuth(refreshed.access, refreshToken, user)

          const headers = new Headers(request.headers)
          headers.set('Authorization', `Bearer ${refreshed.access}`)
          return ky.retry({
            request: new Request(request, { headers }),
            code: 'TOKEN_REFRESHED',
          })
        } catch {
          clearAuth()
          return response
        }
      },
    ],
  },
})