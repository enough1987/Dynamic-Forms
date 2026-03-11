import jsonLogic from 'json-logic-js'
import type { JsonLogicRule } from '@/contracts/field.types'
import type { FormValues } from '@/contracts/form.types'

/**
 * Evaluates a json-logic rule against the current form values.
 * Returns `true` when no rule is provided (field is unconditionally visible).
 * Returns `true`/`false` based on the rule result otherwise.
 */
export function evaluateLogic(rule: JsonLogicRule | undefined, data: FormValues): boolean {
  // No rule means "always show / always pass"
  if (!rule) return true
  return Boolean(jsonLogic.apply(rule as Parameters<typeof jsonLogic.apply>[0], data as Record<string, unknown>))
}
