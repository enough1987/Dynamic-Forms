import { WidgetType } from '@/contracts/enums'
import type { FieldConfig } from '@/contracts/field.types'
import type { FormValues } from '@/contracts/form.types'

export { type FormValues } from '@/contracts/form.types'

/**
 * Builds the initial Formik values from a field config array.
 * Uses each field's `defaultValue` when present, or falls back to
 * `false` for checkboxes and `''` for every other widget type.
 */
export function buildInitialValues(fields: FieldConfig[]): FormValues {
  return fields.reduce<FormValues>((acc, field) => {
    if (field.ui.widget === WidgetType.Checkbox) {
      // Checkbox default is boolean; fall back to unchecked
      acc[field.name] = (field.defaultValue as boolean | undefined) ?? false
    } else {
      // All other widgets default to empty string so inputs are always controlled
      acc[field.name] = (field.defaultValue as string | number | undefined) ?? ''
    }
    return acc
  }, {})
}
