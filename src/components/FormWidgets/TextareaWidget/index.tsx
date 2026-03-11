import { memo } from 'react'
import TextField from '@mui/material/TextField'
import type { TextareaFieldConfig } from '@/contracts/field.types'
import type { FieldFormState } from '@/contracts/form.types'
import { areEqual } from '@/_utils/areEqual'
import { FormStyleType } from '@/contracts/enums'

type TextareaWidgetProps = {
  field: TextareaFieldConfig
  formState: FieldFormState
  styleType?: FormStyleType
  disabled?: boolean
}

export const TextareaWidget = memo(function TextareaWidget({
  field,
  formState,
  styleType,
  disabled,
}: TextareaWidgetProps) {
  const isError = formState.touched && Boolean(formState.error)
  const helperText = (formState.touched && formState.error) || field.ui.helpText || ''
  const isOptionsStyleType = styleType === FormStyleType.Options

  if (!field) return null

  return (
    <TextField
      id={field.name}
      name={field.name}
      label={field.ui.label}
      placeholder={field.ui.placeholder}
      value={formState.value ?? ''}
      onChange={formState.onChange}
      onBlur={formState.onBlur}
      required={Boolean(field.validation?.required)}
      disabled={disabled}
      error={isError}
      helperText={helperText}
      slotProps={{ htmlInput: { maxLength: field.validation?.maxLength } }}
      variant="outlined"
      size="small"
      sx={
        isOptionsStyleType
          ? {
              '& .MuiInputBase-input': { fontSize: '0.75rem' },
              '& .MuiInputLabel-root': { fontSize: '0.75rem' },
              '& .MuiFormHelperText-root': { fontSize: '0.7rem' },
            }
          : undefined
      }
      fullWidth={!isOptionsStyleType}
      multiline
      rows={4}
    />
  )
}, areEqual)
