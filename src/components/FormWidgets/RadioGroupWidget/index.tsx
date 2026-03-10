import { memo } from 'react'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import type { RadioGroupFieldConfig } from '@/contracts/field.types'
import type { FieldFormState } from '@/contracts/form.types'
import { areEqual } from '@/_utils/areEqual'

type RadioGroupWidgetProps = {
  field: RadioGroupFieldConfig
  formState: FieldFormState
}

export const RadioGroupWidget = memo(function RadioGroupWidget({ field, formState }: RadioGroupWidgetProps) {
  const isError = formState.touched && Boolean(formState.error)
  const helperText = formState.touched && formState.error

  if (!field) return null

  return (
    <FormControl error={isError} required={Boolean(field.validation?.required)}>
      <FormLabel id={`${field.name}-label`}>{field.ui.label}</FormLabel>
      <RadioGroup
        aria-labelledby={`${field.name}-label`}
        name={field.name}
        value={formState.value ?? ''}
        onChange={formState.onChange}
        onBlur={formState.onBlur}
      >
        {field.options.map((opt) => (
          <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
        ))}
      </RadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}, areEqual)
