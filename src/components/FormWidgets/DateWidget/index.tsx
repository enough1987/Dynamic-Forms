import { memo } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { type Dayjs } from 'dayjs'
import type { DatePickerFieldConfig } from '@/contracts/field.types'
import { DateFormat } from '@/contracts/formats'
import type { FieldFormState } from '@/contracts/form.types'
import { areEqual } from '@/_utils/areEqual'
import { FormStyleType } from '@/contracts/enums'

type DateWidgetProps = {
  field: DatePickerFieldConfig
  formState: FieldFormState
  styleType?: FormStyleType
  disabled?: boolean
}

export const DateWidget = memo(function DateWidget({ field, formState, styleType, disabled }: DateWidgetProps) {
  const isError = formState.touched && Boolean(formState.error)
  const helperText = (formState.touched && formState.error) || field.ui.helpText || ''
  const isOptionsStyleType = styleType === FormStyleType.Options

  const dayjsValue = formState.value ? dayjs(formState.value as string) : null

  const minDate = field.validation?.minDate
    ? dayjs(typeof field.validation.minDate === 'string' ? field.validation.minDate : field.validation.minDate.value)
    : undefined

  const maxDate = field.validation?.maxDate
    ? dayjs(typeof field.validation.maxDate === 'string' ? field.validation.maxDate : field.validation.maxDate.value)
    : undefined

  function handleChange(date: Dayjs | null): void {
    void formState.setFieldValue(field.name, date ? date.format(DateFormat.ISO) : '')
  }

  function handleClose(): void {
    ;(document.activeElement as HTMLElement | null)?.blur()
  }

  if (!field) return null

  return (
    <DatePicker
      label={field.ui.label}
      value={dayjsValue}
      onChange={handleChange}
      onClose={handleClose}
      minDate={minDate}
      maxDate={maxDate}
      slotProps={{
        textField: {
          id: field.name,
          name: field.name,
          onBlur: () => {
            void formState.setFieldTouched(field.name, true)
          },
          required: Boolean(field.validation?.required),
          disabled,
          error: isError,
          helperText: helperText,
          fullWidth: !isOptionsStyleType,
          variant: 'outlined',
          size: 'small',
          sx: isOptionsStyleType
            ? {
                '& .MuiInputBase-input': { fontSize: '0.75rem', py: '5px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
              }
            : undefined,
        },
        field: { clearable: true },
      }}
    />
  )
}, areEqual)
