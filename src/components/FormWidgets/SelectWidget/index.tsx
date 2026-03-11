import { memo } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MuiSelect from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import type { SelectFieldConfig } from '@/contracts/field.types'
import type { FieldFormState } from '@/contracts/form.types'
import { areEqual } from '@/_utils/areEqual'
import { FormStyleType } from '@/contracts/enums'

type SelectWidgetProps = {
  field: SelectFieldConfig
  formState: FieldFormState
  styleType?: FormStyleType
  disabled?: boolean
}

export const SelectWidget = memo(function SelectWidget({ field, formState, styleType, disabled }: SelectWidgetProps) {
  const labelId = `${field.name}-label`
  const isError = formState.touched && Boolean(formState.error)
  const isOptionsStyleType = styleType === FormStyleType.Options

  if (!field) return null

  return (
    <FormControl
      fullWidth={!isOptionsStyleType}
      variant="outlined"
      error={isError}
      required={Boolean(field.validation?.required)}
      disabled={disabled}
      size="small"
      sx={
        isOptionsStyleType
          ? {
              '& .MuiSelect-select': { fontSize: '0.75rem', py: '5px' },
              '& .MuiInputLabel-root': {
                fontSize: '0.75rem',
                maxWidth: 'calc(100% - 32px)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }
          : {
              '& .MuiInputLabel-root': {
                maxWidth: 'calc(100% - 32px)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }
      }
    >
      <InputLabel id={labelId}>{field.ui.label}</InputLabel>
      <MuiSelect
        labelId={labelId}
        id={field.name}
        name={field.name}
        label={field.ui.label}
        value={formState.value ?? ''}
        onChange={formState.onChange}
        onBlur={formState.onBlur}
      >
        {field.options.map((opt) => (
          <MenuItem
            key={opt.value}
            value={opt.value}
            onClick={() => {
              if (formState.value === opt.value) {
                void formState.setFieldValue(field.name, '')
              }
            }}
          >
            {opt.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  )
}, areEqual)
