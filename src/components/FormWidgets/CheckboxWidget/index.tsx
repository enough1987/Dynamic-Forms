import { memo } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import type { CheckboxFieldConfig } from '@/contracts/field.types'
import type { FieldFormState } from '@/contracts/form.types'
import { areEqual } from '@/_utils/areEqual'
import { FormStyleType } from '@/contracts/enums'

type CheckboxWidgetProps = {
  field: CheckboxFieldConfig
  formState: FieldFormState
  styleType?: FormStyleType
  disabled?: boolean
}

export const CheckboxWidget = memo(function CheckboxWidget({
  field,
  formState,
  styleType,
  disabled,
}: CheckboxWidgetProps) {
  const isError = formState.touched && Boolean(formState.error)
  const helperText = formState.touched && formState.error
  const isOptionsStyleType = styleType === FormStyleType.Options

  if (!field) return null

  return (
    <FormControl
      sx={isOptionsStyleType ? { pl: '8px' } : { width: 'fit-content' }}
      error={isError}
      required={Boolean(field.validation?.required)}
    >
      <FormControlLabel
        sx={isOptionsStyleType ? { '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } } : undefined}
        control={
          <Checkbox
            id={field.name}
            name={field.name}
            checked={Boolean(formState.value)}
            onChange={formState.onChange}
            onBlur={formState.onBlur}
            disabled={disabled}
            size="small"
            sx={isOptionsStyleType ? { padding: '2px' } : undefined}
          />
        }
        label={field.ui.label}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}, areEqual)
