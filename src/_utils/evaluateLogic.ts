import jsonLogic from 'json-logic-js'
import type { JsonLogicRule } from '@/contracts/field.types'
import type { FormValues } from '@/contracts/form.types'

export function evaluateLogic(rule: JsonLogicRule | undefined, data: FormValues): boolean {
  if (!rule) return true
  return Boolean(jsonLogic.apply(rule as Parameters<typeof jsonLogic.apply>[0], data as Record<string, unknown>))
}
