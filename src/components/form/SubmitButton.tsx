import type { ReactNode } from 'react'
import { Button } from '#/components/ui/button'
import { useFormContext } from '#/components/form'
import { cn } from '#/lib/utils'

interface SubmitButtonProps {
  children: ReactNode
  loadingText?: ReactNode
  className?: string
  disabled?: boolean
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function SubmitButton({
  children,
  loadingText,
  className,
  disabled,
  variant = 'default',
  size = 'default',
}: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting] as const}
    >
      {([canSubmit, isSubmitting]) => (
        <Button
          type="submit"
          variant={variant}
          size={size}
          disabled={disabled || !canSubmit || isSubmitting}
          className={cn(className)}
        >
          {isSubmitting ? (loadingText ?? 'Loading…') : children}
        </Button>
      )}
    </form.Subscribe>
  )
}
