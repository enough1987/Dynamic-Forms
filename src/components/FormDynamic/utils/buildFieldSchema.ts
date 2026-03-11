import { z } from 'zod'
import { WidgetType } from '@/contracts/enums'
import type { FieldConfig, RadioGroupFieldConfig, SelectFieldConfig } from '@/contracts/field.types'

/**
 * Builds a Zod validation schema for a single field based on its widget type
 * and its `validation` config. Returns `null` when no validation is needed
 * (e.g. a plain optional text field with no rules), so callers can skip it.
 */
export function buildFieldSchema(field: FieldConfig): z.ZodType | null {
  const v = field.validation
  const widget = field.ui.widget

  // Checkbox — boolean; only rule possible is "must be checked" (required)
  if (widget === WidgetType.Checkbox) {
    const schema = z.boolean()
    return v?.required
      ? schema.refine((isVal) => isVal, {
          message: typeof v.required === 'string' ? v.required : `${field.ui.label} is required`,
        })
      : schema
  }

  // RadioGroup — string value that must be one of the defined option values.
  // Allow '' for optional (not-yet-selected) state; second refine blocks '' when required.
  if (widget === WidgetType.RadioGroup) {
    const validValues = (field as RadioGroupFieldConfig).options.map((o) => String(o.value))
    const schema = z
      .string()
      .refine((val) => val === '' || validValues.includes(val), { message: 'Please select an option' })
    if (!v?.required) return schema.optional()
    return schema.refine((val) => val !== '', {
      message: typeof v.required === 'string' ? v.required : `${field.ui.label} is required`,
    })
  }

  // Select — same pattern as RadioGroup
  if (widget === WidgetType.Select) {
    const validValues = (field as SelectFieldConfig).options.map((o) => String(o.value))
    const schema = z
      .string()
      .refine((val) => val === '' || validValues.includes(val), { message: 'Please select an option' })
    if (!v?.required) return schema.optional()
    return schema.refine((val) => val !== '', {
      message: typeof v.required === 'string' ? v.required : `${field.ui.label} is required`,
    })
  }

  // Remaining widgets require a validation config to produce a schema
  if (!v) return null

  // DatePicker — ISO date string with optional min/max date bounds
  if (widget === WidgetType.DatePicker) {
    let schema: z.ZodType<string> = z.iso.date()

    if (v.minDate !== undefined) {
      const val = typeof v.minDate === 'string' ? v.minDate : v.minDate.value
      const msg = typeof v.minDate === 'string' ? `Date must be on or after ${val}` : v.minDate.message
      schema = schema.refine((_val) => _val >= val, msg)
    }
    if (v.maxDate !== undefined) {
      const val = typeof v.maxDate === 'string' ? v.maxDate : v.maxDate.value
      const msg = typeof v.maxDate === 'string' ? `Date must be on or before ${val}` : v.maxDate.message
      schema = schema.refine((_val) => _val <= val, msg)
    }

    return v.required ? schema : schema.optional()
  }

  // Number — coerces the string input to a number, then applies min/max bounds
  if (widget === WidgetType.Number) {
    let schema = z.coerce.number()

    if (v.min !== undefined) {
      const val = typeof v.min === 'number' ? v.min : v.min.value
      const msg = typeof v.min === 'number' ? `Minimum value is ${String(val)}` : v.min.message
      schema = schema.min(val, msg)
    }
    if (v.max !== undefined) {
      const val = typeof v.max === 'number' ? v.max : v.max.value
      const msg = typeof v.max === 'number' ? `Maximum value is ${String(val)}` : v.max.message
      schema = schema.max(val, msg)
    }

    return v.required ? schema : schema.optional()
  }

  // Input / Textarea — string-based with optional length, email, pattern, and required rules
  let schema = z.string()

  if (v.minLength !== undefined) {
    const val = typeof v.minLength === 'number' ? v.minLength : v.minLength.value
    const msg = typeof v.minLength === 'number' ? `Minimum ${String(val)} characters` : v.minLength.message
    schema = schema.min(val, msg)
  }
  if (v.maxLength !== undefined) {
    const val = typeof v.maxLength === 'number' ? v.maxLength : v.maxLength.value
    const msg = typeof v.maxLength === 'number' ? `Maximum ${String(val)} characters` : v.maxLength.message
    schema = schema.max(val, msg)
  }
  if (v.email) {
    // Allow empty value to pass (required rule below will catch that separately)
    const emailMsg = typeof v.email === 'string' ? v.email : 'Invalid email'
    schema = schema.refine((val) => !val || z.email().safeParse(val).success, emailMsg) as unknown as z.ZodString
  }
  if (v.pattern !== undefined) {
    const val = typeof v.pattern === 'string' ? v.pattern : v.pattern.value
    const msg = typeof v.pattern === 'string' ? 'Invalid format' : v.pattern.message
    schema = schema.regex(new RegExp(val), msg)
  }
  if (v.required) {
    // min(1) rejects empty string, acting as the required check
    const msg = typeof v.required === 'string' ? v.required : `${field.ui.label} is required`
    schema = schema.min(1, msg)
  } else {
    schema = schema.optional() as unknown as z.ZodString
  }

  return schema
}
