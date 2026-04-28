import { useState } from 'react'
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input as UIInput } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { cn, capSplit, fieldErrorMessage } from '#/lib/utils'
import { useFieldContext } from '#/components/form'

type NativeInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'number'
  | 'url'
  | 'search'

export interface FormInputProps {
  label?: false | ReactNode
  type?: NativeInputType
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  autoFocus?: boolean
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  autoLowerCase?: boolean
  autoUpperCase?: boolean
  className?: string
  inputClassName?: string
  labelClassName?: string
  min?: number
  max?: number
  maxLength?: number
}

export function Input(props: FormInputProps) {
  const {
    label,
    type = 'text',
    placeholder,
    required,
    disabled,
    autoComplete,
    autoFocus,
    inputMode,
    autoLowerCase,
    autoUpperCase,
    className,
    inputClassName,
    labelClassName,
    min,
    max,
    maxLength,
  } = props

  const field = useFieldContext<string>()
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const actualType = isPassword && showPassword ? 'text' : type
  const errorMessage =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? fieldErrorMessage(field.state.meta.errors[0])
      : null

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (autoLowerCase) value = value.toLowerCase()
    if (autoUpperCase) value = value.toUpperCase()
    field.handleChange(value)
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label !== false && (
        <Label htmlFor={field.name} className={labelClassName}>
          {label ?? capSplit(field.name)}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      <div className="relative">
        <UIInput
          id={field.name}
          name={field.name}
          type={actualType}
          value={field.state.value ?? ''}
          onChange={handleChange}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          inputMode={inputMode}
          min={min}
          max={max}
          maxLength={maxLength}
          aria-invalid={!!errorMessage}
          className={cn(isPassword && 'pr-10', inputClassName)}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        )}
      </div>
      {errorMessage && (
        <p className="text-xs text-destructive">{errorMessage}</p>
      )}
    </div>
  )
}
