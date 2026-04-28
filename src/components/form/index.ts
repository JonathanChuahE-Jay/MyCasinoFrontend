import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { Input } from '#/components/form/Input'
import { FieldInfo } from '#/components/form/FieldInfo'
import { SubmitButton } from '#/components/form/SubmitButton'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    Input,
    FieldInfo,
  },
  formComponents: {
    SubmitButton,
  },
})
