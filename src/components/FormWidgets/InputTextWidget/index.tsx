import { memo } from 'react'
import TextField from '@mui/material/TextField'
import type { InputFieldConfig } from '@/contracts/field.types'
import type { FieldFormState } from '@/contracts/form.types'
import { areEqual } from '@/_utils/areEqual'
import { FormStyleType } from '@/contracts/enums'

type InputTextWidgetProps = {
  field: InputFieldConfig
  formState: FieldFormState
  styleType?: FormStyleType
  disabled?: boolean
}

export const InputTextWidget = memo(function InputTextWidget({
  field,
  formState,
  styleType,
  disabled,
}: InputTextWidgetProps) {
  const isError = formState.touched && Boolean(formState.error)
  const helperText = (formState.touched && formState.error) || field.ui.helpText || ''
  const isOptionsStyleType = styleType === FormStyleType.Options

  if (!field) return null

  return (
    <TextField
      id={field.name}
      name={field.name}
      label={field.ui?.label}
      type={field.ui?.inputType ?? 'text'}
      placeholder={field.ui?.placeholder}
      value={formState.value ?? ''}
      onChange={formState.onChange}
      onBlur={formState.onBlur}
      required={Boolean(field.validation?.required)}
      disabled={disabled}
      error={isError}
      helperText={helperText}
      slotProps={{ htmlInput: { pattern: field.ui?.pattern, maxLength: field.validation?.maxLength } }}
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
    />
  )
}, areEqual)
