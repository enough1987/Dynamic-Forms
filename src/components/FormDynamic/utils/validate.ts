import type { FieldConfig } from '@/contracts/field.types'
import type { FormValues } from '@/contracts/form.types'
import { evaluateLogic } from '@/_utils/evaluateLogic'
import { buildValidationSchema } from './buildValidationSchema'

/**
 * Formik-compatible validate function. Runs Zod validation against the current
 * form values and returns a flat `{ fieldName: errorMessage }` map.
 *
 * Only visible fields are validated — hidden fields are excluded from the schema
 * so they can't produce spurious errors that would block submission.
 */
export function validate(fields: FieldConfig[], values: FormValues): Record<string, string> {
  // Exclude hidden fields so their (potentially stale) values don't trigger errors
  const visibleFields = fields.filter((f) => evaluateLogic(f.logic?.visibleIf, values))

  // Build a Zod schema covering only the currently visible fields
  const schema = buildValidationSchema(visibleFields)

  const result = schema.safeParse(values)

  // No issues — return empty object to tell Formik the form is valid
  if (result.success) return {}

  // Collapse Zod's issue array into a single error per field.
  // First error wins; subsequent issues for the same field are ignored.
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0] as string
    if (key && !errors[key]) errors[key] = issue.message
  }
  return errors
}
