import { useFieldContext } from '#/components/form'
import { cn, fieldErrorMessage } from '#/lib/utils'

interface FieldInfoProps {
  className?: string
}

export function FieldInfo({ className }: FieldInfoProps) {
  const field = useFieldContext()
  if (!field.state.meta.isTouched) return null
  const message = fieldErrorMessage(field.state.meta.errors[0])
  if (!message) return null
  return <p className={cn('text-xs text-destructive', className)}>{message}</p>
}
