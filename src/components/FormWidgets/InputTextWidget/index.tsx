import { memo } from 'react'
import TextField from '@mui/material/TextField'
import type { InputFieldConfig } from '@/contracts/field.types'
import type { FieldFormState } from '@/contracts/form.types'
import { areEqual } from '@/_utils/areEqual'

type InputTextWidgetProps = {
  field: InputFieldConfig
  formState: FieldFormState
}

export const InputTextWidget = memo(function InputTextWidget({ field, formState }: InputTextWidgetProps) {
  const isError = formState.touched && Boolean(formState.error)
  const helperText = (formState.touched && formState.error) || field.ui.helpText || ''

  if (!field) return null

  return (
    <TextField
      id={field.name}
      name={field.name}
      label={field.ui?.label}
      type={field.ui?.inputType ?? 'text'}
      placeholder={field.ui?.placeholder}
      value={formState.value}
      onChange={formState.onChange}
      onBlur={formState.onBlur}
      required={Boolean(field.validation?.required)}
      error={isError}
      helperText={helperText}
      slotProps={{ htmlInput: { pattern: field.ui?.pattern, maxLength: field.validation?.maxLength } }}
      variant="outlined"
      fullWidth
    />
  )
}, areEqual)
