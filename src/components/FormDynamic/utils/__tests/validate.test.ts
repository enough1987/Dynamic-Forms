import { describe, it, expect } from 'vitest'
import { validate } from '../validate'
import { FieldDataType, WidgetType } from '@/contracts/enums'
import type { FieldConfig } from '@/contracts/field.types'

const emailField: FieldConfig = {
  name: 'email',
  type: FieldDataType.Text,
  ui: { label: 'Email', widget: WidgetType.Input },
  validation: { required: true, email: true },
}

const ageField: FieldConfig = {
  name: 'age',
  type: FieldDataType.Integer,
  ui: { label: 'Age', widget: WidgetType.Number },
  validation: { required: true, min: 18, max: 65 },
}

const notesField: FieldConfig = {
  name: 'notes',
  type: FieldDataType.Text,
  ui: { label: 'Notes', widget: WidgetType.Textarea },
  validation: { required: true, minLength: 10 },
  logic: { visibleIf: { '>=': [{ var: 'age' }, 40] } },
}

describe('validate', () => {
  it('should return empty object for valid values', () => {
    const errors = validate([emailField, ageField], {
      email: 'user@example.com',
      age: 25,
    })
    expect(errors).toEqual({})
  })

  it('should return errors for invalid values', () => {
    const errors = validate([emailField, ageField], {
      email: 'not-an-email',
      age: 5,
    })
    expect(errors).toHaveProperty('email')
    expect(errors).toHaveProperty('age')
  })

  it('should not validate hidden fields', () => {
    // notesField only visible when age >= 40
    const errors = validate([emailField, ageField, notesField], {
      email: 'user@example.com',
      age: 25,
      notes: '', // would fail validation if visible
    })
    expect(errors).not.toHaveProperty('notes')
  })

  it('should validate hidden-turned-visible fields', () => {
    const errors = validate([emailField, ageField, notesField], {
      email: 'user@example.com',
      age: 50,
      notes: 'short', // too short (minLength 10)
    })
    expect(errors).toHaveProperty('notes')
  })

  it('should return only first error per field', () => {
    const errors = validate([emailField], { email: '' })
    expect(typeof errors.email).toBe('string')
  })

  it('should return empty object for empty fields array', () => {
    expect(validate([], {})).toEqual({})
  })
})
