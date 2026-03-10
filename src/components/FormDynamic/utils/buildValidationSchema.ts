import { z } from 'zod'
import type { FieldConfig } from '@/contracts/field.types'
import { buildFieldSchema } from './buildFieldSchema'

export function buildValidationSchema(fields: FieldConfig[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape = fields.reduce<Record<string, z.ZodTypeAny>>((acc, field) => {
    const schema = buildFieldSchema(field)
    if (schema) acc[field.name] = schema
    return acc
  }, {})
  return z.object(shape)
}
