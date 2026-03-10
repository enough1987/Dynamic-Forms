import { memo } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MuiSelect from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import type { SelectFieldConfig } from '@/contracts/field.types'
import type { FieldFormState } from '@/contracts/form.types'
import { areEqual } from '@/_utils/areEqual'

type SelectWidgetProps = {
  field: SelectFieldConfig
  formState: FieldFormState
}

export const SelectWidget = memo(function SelectWidget({ field, formState }: SelectWidgetProps) {
  const labelId = `${field.name}-label`
  const isError = formState.touched && Boolean(formState.error)

  return (
    <FormControl fullWidth variant="outlined" error={isError} required={Boolean(field.validation?.required)}>
      <InputLabel id={labelId}>{field.ui.label}</InputLabel>
      <MuiSelect
        labelId={labelId}
        id={field.name}
        name={field.name}
        label={field.ui.label}
        value={formState.value}
        onChange={formState.onChange}
        onBlur={formState.onBlur}
      >
        {field.options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  )
}, areEqual)
