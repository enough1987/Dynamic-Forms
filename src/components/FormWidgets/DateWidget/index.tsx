import { memo } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { type Dayjs } from 'dayjs'
import type { DatePickerFieldConfig } from '@/contracts/field.types'
import { DateFormat } from '@/contracts/formats'
import type { FieldFormState } from '@/contracts/form.types'
import { areEqual } from '@/_utils/areEqual'

type DateWidgetProps = {
  field: DatePickerFieldConfig
  formState: FieldFormState
}

export const DateWidget = memo(function DateWidget({ field, formState }: DateWidgetProps) {
  const isError = formState.touched && Boolean(formState.error)
  const helperText = (formState.touched && formState.error) || field.ui.helpText || ''

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
          error: isError,
          helperText: helperText,
          fullWidth: true,
          variant: 'outlined',
        },
        field: { clearable: true },
      }}
    />
  )
}, areEqual)
