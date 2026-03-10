import { z } from 'zod'
import { WidgetType } from '@/contracts/enums'
import type { FieldConfig, RadioGroupFieldConfig, SelectFieldConfig } from '@/contracts/field.types'

export function buildFieldSchema(field: FieldConfig): z.ZodTypeAny | null {
  const v = field.validation
  const widget = field.ui.widget

  if (widget === WidgetType.Checkbox) {
    const schema = z.boolean()
    return v?.required ? schema.refine((val) => val === true, {
      message: typeof v.required === 'string' ? v.required : `${field.ui.label} is required`,
    }) : schema
  }

  if (widget === WidgetType.RadioGroup) {
    const validValues = (field as RadioGroupFieldConfig).options.map((o) => String(o.value))
    const schema = z.string().refine((val) => validValues.includes(val), { message: 'Please select an option' })
    return v?.required ? schema : schema.optional()
  }

  if (widget === WidgetType.Select) {
    const validValues = (field as SelectFieldConfig).options.map((o) => String(o.value))
    const schema = z.string().refine((val) => val === '' || validValues.includes(val), { message: 'Please select an option' })
    if (!v?.required) return schema.optional()
    return schema.refine((val) => val !== '', {
      message: typeof v.required === 'string' ? v.required : `${field.ui.label} is required`,
    })
  }

  if (!v) return null

  if (widget === WidgetType.DatePicker) {
    let schema = z.string().date('Invalid date')

    if (v.minDate !== undefined) {
      const val = typeof v.minDate === 'string' ? v.minDate : v.minDate.value
      const msg = typeof v.minDate === 'string' ? `Date must be on or after ${val}` : v.minDate.message
      schema = schema.refine((d) => d >= val, msg) as typeof schema
    }
    if (v.maxDate !== undefined) {
      const val = typeof v.maxDate === 'string' ? v.maxDate : v.maxDate.value
      const msg = typeof v.maxDate === 'string' ? `Date must be on or before ${val}` : v.maxDate.message
      schema = schema.refine((d) => d <= val, msg) as typeof schema
    }

    return v.required ? schema : schema.optional()
  }

  if (widget === WidgetType.Number) {
    let schema = z.coerce.number()

    if (v.min !== undefined) {
      const val = typeof v.min === 'number' ? v.min : v.min.value
      const msg = typeof v.min === 'number' ? `Minimum value is ${val}` : v.min.message
      schema = schema.min(val, msg)
    }
    if (v.max !== undefined) {
      const val = typeof v.max === 'number' ? v.max : v.max.value
      const msg = typeof v.max === 'number' ? `Maximum value is ${val}` : v.max.message
      schema = schema.max(val, msg)
    }

    return v.required ? schema : schema.optional()
  }

  // Input, Textarea — string-based
  let schema = z.string()

  if (v.minLength !== undefined) {
    const val = typeof v.minLength === 'number' ? v.minLength : v.minLength.value
    const msg = typeof v.minLength === 'number' ? `Minimum ${val} characters` : v.minLength.message
    schema = schema.min(val, msg)
  }
  if (v.maxLength !== undefined) {
    const val = typeof v.maxLength === 'number' ? v.maxLength : v.maxLength.value
    const msg = typeof v.maxLength === 'number' ? `Maximum ${val} characters` : v.maxLength.message
    schema = schema.max(val, msg)
  }
  if (v.email) {
    schema = schema.email(typeof v.email === 'string' ? v.email : 'Invalid email')
  }
  if (v.pattern !== undefined) {
    const val = typeof v.pattern === 'string' ? v.pattern : v.pattern.value
    const msg = typeof v.pattern === 'string' ? 'Invalid format' : v.pattern.message
    schema = schema.regex(new RegExp(val), msg)
  }
  if (v.required) {
    const msg = typeof v.required === 'string' ? v.required : `${field.ui.label} is required`
    schema = schema.min(1, msg)
  } else {
    schema = schema.optional() as unknown as z.ZodString
  }

  return schema
}
