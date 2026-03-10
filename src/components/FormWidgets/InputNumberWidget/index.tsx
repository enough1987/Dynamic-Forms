import { memo } from 'react'
import TextField from '@mui/material/TextField'
import type { NumberFieldConfig } from '@/contracts/field.types'
import type { FieldFormState } from '@/contracts/form.types'
import { areEqual } from '@/_utils/areEqual'

const BLOCKED_NUMBER_KEYS = new Set(['e', 'E', '+', '-'])

function blockNumberChars(e: React.KeyboardEvent<HTMLInputElement>): void {
  if (BLOCKED_NUMBER_KEYS.has(e.key)) e.preventDefault()
}

type InputNumberWidgetProps = {
  field: NumberFieldConfig
  formState: FieldFormState
}

export const InputNumberWidget = memo(function InputNumberWidget({ field, formState }: InputNumberWidgetProps) {
  const isError = formState.touched && Boolean(formState.error)
  const helperText = (formState.touched && formState.error) || field.ui.helpText || ''

  return (
    <TextField
      id={field.name}
      name={field.name}
      label={field.ui.label}
      type="number"
      placeholder={field.ui.placeholder}
      value={formState.value}
      onChange={formState.onChange}
      onBlur={formState.onBlur}
      onKeyDown={blockNumberChars}
      required={Boolean(field.validation?.required)}
      error={isError}
      helperText={helperText}
      variant="outlined"
      fullWidth
      slotProps={{
        htmlInput: {
          min: field.validation?.min,
          max: field.validation?.max,
        },
      }}
    />
  )
}, areEqual)
