import { z } from 'zod'
import type { FieldConfig } from '@/contracts/field.types'
import { buildFieldSchema } from './buildFieldSchema'

/**
 * Builds a single Zod object schema that covers all fields in the form.
 * Fields that return `null` from `buildFieldSchema` (no validation rules)
 * are omitted from the shape so Zod doesn't flag them as unknown keys.
 */
export function buildValidationSchema(fields: FieldConfig[]): z.ZodObject<Record<string, z.ZodType>> {
  const shape = fields.reduce<Record<string, z.ZodType>>((acc, field) => {
    const schema = buildFieldSchema(field)
    // Only include fields that have at least one validation rule
    if (schema) acc[field.name] = schema
    return acc
  }, {})
  return z.object(shape)
}
