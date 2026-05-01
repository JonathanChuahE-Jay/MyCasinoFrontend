import { createFileRoute, Link } from '@tanstack/react-router'
import { useAppForm } from '#/components/form'
import { useRegisterMutation } from '#/queries/auth/register.ts'
import type { RegisterType } from '#/schemas/auth/register.ts'
import { registerSchema } from '#/schemas/auth/register.ts'
import { UserRoleEnumType } from '#/types/auth'
import logo from '#/assets/common/logo.png'

export const Route = createFileRoute('/(unauthenticated)/(auth)/register')({
  component: RegisterPage,
})

const defaultValues: RegisterType = {
  phone_number: '',
  password: '',
  confirm_password: '',
  role: UserRoleEnumType.CUSTOMER,
  referral_code: '',
}

function RegisterPage() {
  const registerMutation = useRegisterMutation()

  const form = useAppForm({
    defaultValues,
    validators: { onChange: registerSchema },
    onSubmit: async ({ value }) => {
      const payload: RegisterType = {
        ...value,
        referral_code: value.referral_code?.trim() || undefined,
      }
      await registerMutation.mutateAsync(payload)
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="casino-card rounded-2xl p-8 w-full max-w-sm rise-in">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt='logo' className="casino-emblem mb-4"/>
          <h1 className="display-title text-3xl font-bold tracking-wide text-foreground">
            Create Account
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Join the table tonight
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
                autoComplete="new-password"
              />
            )}
          </form.AppField>

          <form.AppField name="confirm_password">
            {(field) => (
              <field.Input
                required
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            )}
          </form.AppField>

          <form.AppField name="referral_code">
            {(field) => (
              <field.Input
                type="text"
                label={
                  <>
                    Referral Code{' '}
                    <span className="text-xs font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </>
                }
                placeholder="ABC123"
                autoUpperCase
                maxLength={6}
              />
            )}
          </form.AppField>

          <form.AppForm>
            <form.SubmitButton
              className="w-full mt-2"
              loadingText="Creating account…"
            >
              Create Account
            </form.SubmitButton>
          </form.AppForm>
        </form>

        <p className="text-center text-sm mt-6 text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
