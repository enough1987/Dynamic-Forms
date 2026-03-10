import { memo } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import type { CheckboxFieldConfig } from '@/contracts/field.types'
import type { FieldFormState } from '@/contracts/form.types'
import { areEqual } from '@/_utils/areEqual'

type CheckboxWidgetProps = {
  field: CheckboxFieldConfig
  formState: FieldFormState
}

export const CheckboxWidget = memo(function CheckboxWidget({ field, formState }: CheckboxWidgetProps) {
  const isError = formState.touched && Boolean(formState.error)
  const helperText = formState.touched && formState.error

  if (!field) return null

  return (
    <FormControl error={isError} required={Boolean(field.validation?.required)}>
      <FormControlLabel
        control={
          <Checkbox
            id={field.name}
            name={field.name}
            checked={Boolean(formState.value)}
            onChange={formState.onChange}
            onBlur={formState.onBlur}
          />
        }
        label={field.ui.label}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}, areEqual)
