import { memo } from 'react'
import TextField from '@mui/material/TextField'
import type { NumberFieldConfig } from '@/contracts/field.types'
import type { FieldFormState } from '@/contracts/form.types'
import { areEqual } from '@/_utils/areEqual'
import { FormStyleType } from '@/contracts/enums'

const BLOCKED_NUMBER_KEYS = new Set(['e', 'E', '+', '-'])

function blockNumberChars(e: React.KeyboardEvent<HTMLInputElement>): void {
  if (BLOCKED_NUMBER_KEYS.has(e.key)) e.preventDefault()
}

type InputNumberWidgetProps = {
  field: NumberFieldConfig
  formState: FieldFormState
  styleType?: FormStyleType
  disabled?: boolean
}

export const InputNumberWidget = memo(function InputNumberWidget({
  field,
  formState,
  styleType,
  disabled,
}: InputNumberWidgetProps) {
  const isError = formState.touched && Boolean(formState.error)
  const helperText = (formState.touched && formState.error) || field.ui.helpText || ''
  const isOptionsStyleType = styleType === FormStyleType.Options

  if (!field) return null

  return (
    <TextField
      id={field.name}
      name={field.name}
      label={field.ui.label}
      type="number"
      placeholder={field.ui.placeholder}
      value={formState.value ?? ''}
      onChange={formState.onChange}
      onBlur={formState.onBlur}
      onKeyDown={blockNumberChars}
      required={Boolean(field.validation?.required)}
      disabled={disabled}
      error={isError}
      helperText={helperText}
      variant="outlined"
      size="small"
      sx={
        isOptionsStyleType
          ? {
              '& .MuiInputBase-input': { fontSize: '0.75rem', py: '5px' },
              '& .MuiInputLabel-root': { fontSize: '0.75rem' },
              '& .MuiFormHelperText-root': { fontSize: '0.7rem' },
            }
          : undefined
      }
      fullWidth={!isOptionsStyleType}
      slotProps={{
        htmlInput: {
          min: field.validation?.min,
          max: field.validation?.max,
        },
      }}
    />
  )
}, areEqual)
