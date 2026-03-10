import { WidgetType } from '@/contracts/enums'
import type { FieldConfig } from '@/contracts/field.types'
import type { FormValues } from '@/contracts/form.types'

export { type FormValues } from '@/contracts/form.types'

export function buildInitialValues(fields: FieldConfig[]): FormValues {
  return fields.reduce<FormValues>((acc, field) => {
    if (field.ui.widget === WidgetType.Checkbox) {
      acc[field.name] = (field.defaultValue as boolean | undefined) ?? false
    } else {
      acc[field.name] = (field.defaultValue as string | number | undefined) ?? ''
    }
    return acc
  }, {})
}
