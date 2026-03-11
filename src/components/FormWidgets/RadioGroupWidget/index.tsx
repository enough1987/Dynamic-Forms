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
import { FormStyleType } from '@/contracts/enums'

type RadioGroupWidgetProps = {
  field: RadioGroupFieldConfig
  formState: FieldFormState
  styleType?: FormStyleType
  disabled?: boolean
}

export const RadioGroupWidget = memo(function RadioGroupWidget({
  field,
  formState,
  styleType,
  disabled,
}: RadioGroupWidgetProps) {
  const isError = formState.touched && Boolean(formState.error)
  const helperText = formState.touched && formState.error
  const isOptionsStyleType = styleType === FormStyleType.Options

  if (!field) return null

  return (
    <FormControl error={isError} required={Boolean(field.validation?.required)} disabled={disabled}>
      <FormLabel id={`${field.name}-label`} sx={isOptionsStyleType ? { fontSize: '0.75rem' } : undefined}>
        {field.ui.label}
      </FormLabel>
      <RadioGroup
        aria-labelledby={`${field.name}-label`}
        name={field.name}
        value={formState.value ?? ''}
        onChange={formState.onChange}
        onBlur={formState.onBlur}
      >
        {field.options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio size="small" sx={isOptionsStyleType ? { padding: '2px' } : undefined} />}
            label={opt.label}
            sx={isOptionsStyleType ? { '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } } : undefined}
          />
        ))}
      </RadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}, areEqual)
