import type { FieldConfig } from '@/contracts/field.types'
import type { FormValues } from '@/contracts/form.types'
import { evaluateLogic } from '@/_utils/evaluateLogic'
import { buildValidationSchema } from './buildValidationSchema'

export function validate(fields: FieldConfig[], values: FormValues): Record<string, string> {
  const visibleFields = fields.filter((f) => evaluateLogic(f.logic?.visibleIf, values))
  const schema = buildValidationSchema(visibleFields)
  const result = schema.safeParse(values)
  if (result.success) return {}
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0] as string
    if (key && !errors[key]) errors[key] = issue.message
  }
  return errors
}
