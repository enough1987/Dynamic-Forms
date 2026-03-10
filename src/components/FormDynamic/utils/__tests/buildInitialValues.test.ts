import { describe, it, expect } from 'vitest'
import { buildInitialValues } from '../buildInitialValues'
import { FieldDataType, WidgetType } from '@/contracts/enums'
import type { FieldConfig } from '@/contracts/field.types'

describe('buildInitialValues', () => {
  it('should return empty string for input fields with no defaultValue', () => {
    const fields: FieldConfig[] = [
      { name: 'name', type: FieldDataType.Text, ui: { label: 'Name', widget: WidgetType.Input } },
    ]
    expect(buildInitialValues(fields)).toEqual({ name: '' })
  })

  it('should return false for checkbox fields with no defaultValue', () => {
    const fields: FieldConfig[] = [
      { name: 'accept', type: FieldDataType.Text, ui: { label: 'Accept', widget: WidgetType.Checkbox } },
    ]
    expect(buildInitialValues(fields)).toEqual({ accept: false })
  })

  it('should use defaultValue for input field', () => {
    const fields: FieldConfig[] = [
      {
        name: 'country',
        type: FieldDataType.Text,
        defaultValue: 'fr',
        ui: { label: 'Country', widget: WidgetType.Input },
      },
    ]
    expect(buildInitialValues(fields)).toEqual({ country: 'fr' })
  })

  it('should use boolean defaultValue for checkbox field', () => {
    const fields: FieldConfig[] = [
      {
        name: 'accept',
        type: FieldDataType.Text,
        defaultValue: true,
        ui: { label: 'Accept', widget: WidgetType.Checkbox },
      },
    ]
    expect(buildInitialValues(fields)).toEqual({ accept: true })
  })

  it('should return empty string for select fields by default', () => {
    const fields: FieldConfig[] = [
      {
        name: 'region',
        type: FieldDataType.Text,
        ui: { label: 'Region', widget: WidgetType.Select },
        options: [{ value: 'eu', label: 'Europe' }],
      },
    ]
    expect(buildInitialValues(fields)).toEqual({ region: '' })
  })

  it('should handle multiple fields of different types', () => {
    const fields: FieldConfig[] = [
      { name: 'email', type: FieldDataType.Text, ui: { label: 'Email', widget: WidgetType.Input } },
      { name: 'age', type: FieldDataType.Integer, ui: { label: 'Age', widget: WidgetType.Number } },
      { name: 'agree', type: FieldDataType.Text, ui: { label: 'Agree', widget: WidgetType.Checkbox } },
    ]
    expect(buildInitialValues(fields)).toEqual({ email: '', age: '', agree: false })
  })

  it('should return empty object for empty fields array', () => {
    expect(buildInitialValues([])).toEqual({})
  })
})
