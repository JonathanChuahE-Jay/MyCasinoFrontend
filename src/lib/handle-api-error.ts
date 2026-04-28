import { HTTPError } from 'ky'
import { z } from 'zod/v4'
import { toast } from 'sonner'

interface HandleApiErrorOptions {
  showToast?: boolean
  format?: 'simple' | 'detailed'
}

export interface HandleApiErrorResult {
  message: string
  missing_fields?: unknown
  available_options?: unknown
}

function valueToString(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value && typeof value === 'object' && 'label' in value) {
    return String((value as Record<string, unknown>).label)
  }
  if (value && typeof value === 'object' && 'message' in value) {
    return String((value as Record<string, unknown>).message)
  }
  return JSON.stringify(value)
}

export async function handleApiError(
  error: unknown,
  options: HandleApiErrorOptions = {},
): Promise<HandleApiErrorResult> {
  const { showToast = true, format = 'simple' } = options

  let errorMessage = 'Unknown error'
  let missing_fields: unknown
  let available_options: unknown

  if (error instanceof HTTPError) {
    const hydrated = (error as HTTPError & { data?: unknown }).data
    const errorData = (
      hydrated !== undefined
        ? hydrated
        : await error.response.json().catch(() => ({}))
    ) as Record<string, unknown>

    if (errorData.missing_fields) {
      missing_fields = errorData.missing_fields
    }

    if (errorData.available_options) {
      available_options = errorData.available_options
    }

    if (
      errorData.error &&
      Array.isArray(errorData.error) &&
      errorData.error.length > 0
    ) {
      errorMessage = errorData.error.map(valueToString).join(', ')
    } else if (typeof errorData.error === 'string') {
      errorMessage = errorData.error
    } else if (errorData.detail) {
      errorMessage = valueToString(errorData.detail)
    } else if (typeof errorData === 'object') {
      if (format === 'simple') {
        const messages: Array<string> = []
        for (const [, value] of Object.entries(errorData)) {
          if (Array.isArray(value)) {
            messages.push(...value.map(valueToString))
          } else {
            messages.push(valueToString(value))
          }
        }
        errorMessage =
          messages.length > 0 ? messages.join(', ') : JSON.stringify(errorData)
      } else {
        errorMessage = Object.entries(errorData)
          .map(([key, value]) => {
            const formattedValue = Array.isArray(value)
              ? value.map(valueToString).join(', ')
              : valueToString(value)
            return `Error in ${key}: ${formattedValue}`
          })
          .join('\n\n')
      }
    } else {
      errorMessage = 'API Error: Invalid response format'
    }
  } else if (error instanceof z.ZodError) {
    console.error('Validation Error:', z.prettifyError(error))
    errorMessage = z.prettifyError(error)
  } else {
    console.error('Unknown Error:', error)
    errorMessage = 'Unknown error'
  }

  if (showToast) {
    toast.error(errorMessage)
  }

  return {
    message: errorMessage,
    missing_fields,
    available_options,
  }
}