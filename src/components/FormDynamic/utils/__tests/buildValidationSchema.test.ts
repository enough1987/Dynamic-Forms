import { describe, it, expect } from 'vitest'
import { buildValidationSchema } from '../buildValidationSchema'
import { FieldDataType, WidgetType } from '@/contracts/enums'
import type { FieldConfig } from '@/contracts/field.types'

describe('buildValidationSchema', () => {
  it('should return a ZodObject with entries for fields that have schemas', () => {
    const fields: FieldConfig[] = [
      {
        name: 'email',
        type: FieldDataType.Text,
        ui: { label: 'Email', widget: WidgetType.Input },
        validation: { required: true, email: true },
      },
      {
        name: 'age',
        type: FieldDataType.Integer,
        ui: { label: 'Age', widget: WidgetType.Number },
        validation: { required: true, min: 1, max: 120 },
      },
    ]
    const schema = buildValidationSchema(fields)
    const result = schema.safeParse({ email: 'user@example.com', age: 25 })
    expect(result.success).toBe(true)
  })

  it('should report errors for multiple invalid fields', () => {
    const fields: FieldConfig[] = [
      {
        name: 'email',
        type: FieldDataType.Text,
        ui: { label: 'Email', widget: WidgetType.Input },
        validation: { required: true, email: true },
      },
      {
        name: 'age',
        type: FieldDataType.Integer,
        ui: { label: 'Age', widget: WidgetType.Number },
        validation: { required: true, min: 18 },
      },
    ]
    const schema = buildValidationSchema(fields)
    const result = schema.safeParse({ email: 'not-an-email', age: 5 })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0])
      expect(paths).toContain('email')
      expect(paths).toContain('age')
    }
  })

  it('should skip fields without validation config (non-widget fields)', () => {
    const fields: FieldConfig[] = [
      {
        name: 'notes',
        type: FieldDataType.Text,
        ui: { label: 'Notes', widget: WidgetType.Input },
        // no validation
      },
    ]
    const schema = buildValidationSchema(fields)
    // schema should be a ZodObject — parsing anything returns success since no constraints
    expect(schema.safeParse({ notes: '' }).success).toBe(true)
  })

  it('should always include Checkbox fields in the schema', () => {
    const fields: FieldConfig[] = [
      {
        name: 'accept',
        type: FieldDataType.Text,
        ui: { label: 'Accept', widget: WidgetType.Checkbox },
        validation: { required: true },
      },
    ]
    const schema = buildValidationSchema(fields)
    expect(schema.safeParse({ accept: false }).success).toBe(false)
    expect(schema.safeParse({ accept: true }).success).toBe(true)
  })

  it('should return an empty ZodObject for empty fields array', () => {
    const schema = buildValidationSchema([])
    expect(schema.safeParse({}).success).toBe(true)
  })
})
