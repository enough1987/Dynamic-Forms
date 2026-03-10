import { memo } from 'react'
import TextField from '@mui/material/TextField'
import type { TextareaFieldConfig } from '@/contracts/field.types'
import type { FieldFormState } from '@/contracts/form.types'
import { areEqual } from '@/_utils/areEqual'

type TextareaWidgetProps = {
  field: TextareaFieldConfig
  formState: FieldFormState
}

export const TextareaWidget = memo(function TextareaWidget({ field, formState }: TextareaWidgetProps) {
  const isError = formState.touched && Boolean(formState.error)
  const helperText = (formState.touched && formState.error) || field.ui.helpText || ''

  if(!field) return null

  return (
    <TextField
      id={field.name}
      name={field.name}
      label={field.ui.label}
      placeholder={field.ui.placeholder}
      value={formState.value}
      onChange={formState.onChange}
      onBlur={formState.onBlur}
      required={Boolean(field.validation?.required)}
      error={isError}
      helperText={helperText}
      slotProps={{ htmlInput: { maxLength: field.validation?.maxLength } }}
      variant="outlined"
      fullWidth
      multiline
      rows={4}
    />
  )
}, areEqual)
