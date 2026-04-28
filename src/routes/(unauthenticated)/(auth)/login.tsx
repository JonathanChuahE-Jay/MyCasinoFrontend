import { createFileRoute, Link } from '@tanstack/react-router'
import { Spade } from 'lucide-react'
import { useAppForm } from '#/components/form'
import { useLoginMutation } from '#/queries/auth/login.ts'
import type { LoginType } from '#/schemas/auth/login.ts'
import { loginSchema } from '#/schemas/auth/login.ts'

export const Route = createFileRoute('/(unauthenticated)/(auth)/login')({
  component: LoginPage,
})

const defaultValues: LoginType = { phone_number: '', password: '' }

function LoginPage() {
  const loginMutation = useLoginMutation()

  const form = useAppForm({
    defaultValues,
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value)
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="casino-card rounded-2xl p-8 w-full max-w-sm rise-in">
        <div className="flex flex-col items-center mb-8">
          <div className="casino-emblem mb-4">
            <Spade className="size-7" fill="currentColor" />
          </div>
          <h1 className="display-title text-3xl font-bold tracking-wide text-foreground">
            Welcome Back
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Sign in to continue your luck
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <form.AppField name="phone_number">
            {(field) => (
              <field.Input
                required
                type="tel"
                label="Phone Number"
                placeholder="01234567890"
                autoComplete="tel"
                inputMode="numeric"
              />
            )}
          </form.AppField>

          <form.AppField name="password">
            {(field) => (
              <field.Input
                required
                type="password"
                label="Password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            )}
          </form.AppField>

          <form.AppForm>
            <form.SubmitButton
              className="w-full mt-2"
              loadingText="Signing in…"
            >
              Sign In
            </form.SubmitButton>
          </form.AppForm>
        </form>

        <p className="text-center text-sm mt-6 text-muted-foreground">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
