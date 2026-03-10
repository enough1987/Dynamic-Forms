import { describe, it, expect } from 'vitest'
import { buildFieldSchema } from '../buildFieldSchema'
import { FieldDataType, WidgetType } from '@/contracts/enums'
import type { FieldConfig } from '@/contracts/field.types'

// ─── helpers ────────────────────────────────────────────────────────────────

function parse(field: FieldConfig, value: unknown) {
  return buildFieldSchema(field)?.safeParse(value)
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

describe('buildFieldSchema – Checkbox', () => {
  const base: FieldConfig = {
    name: 'accept',
    type: FieldDataType.Text,
    ui: { label: 'Accept', widget: WidgetType.Checkbox },
  }

  it('should accept true without required', () => {
    expect(parse(base, true)?.success).toBe(true)
  })

  it('should accept false without required', () => {
    expect(parse(base, false)?.success).toBe(true)
  })

  it('should reject false when required:true', () => {
    const field = { ...base, validation: { required: true as const } }
    const result = parse(field, false)
    expect(result?.success).toBe(false)
  })

  it('should accept true when required:true', () => {
    const field = { ...base, validation: { required: true as const } }
    expect(parse(field, true)?.success).toBe(true)
  })

  it('should use custom required message', () => {
    const field = { ...base, validation: { required: 'You must accept' } }
    const result = parse(field, false)
    expect(result?.success).toBe(false)
    if (!result?.success) {
      expect(result.error.issues[0].message).toBe('You must accept')
    }
  })
})

// ─── Select ──────────────────────────────────────────────────────────────────

describe('buildFieldSchema – Select', () => {
  const base: FieldConfig = {
    name: 'country',
    type: FieldDataType.Text,
    ui: { label: 'Country', widget: WidgetType.Select },
    options: [
      { value: 'fr', label: 'France' },
      { value: 'de', label: 'Germany' },
    ],
  }

  it('should accept a valid option value', () => {
    expect(parse(base, 'fr')?.success).toBe(true)
  })

  it('should accept empty string when not required', () => {
    expect(parse(base, '')?.success).toBe(true)
  })

  it('should reject empty string when required', () => {
    const field = { ...base, validation: { required: true as const } }
    expect(parse(field, '')?.success).toBe(false)
  })

  it('should reject value not in options', () => {
    const field = { ...base, validation: { required: true as const } }
    expect(parse(field, 'xx')?.success).toBe(false)
  })

  it('should use custom required message', () => {
    const field = { ...base, validation: { required: 'Please choose a country' } }
    const result = parse(field, '')
    expect(result?.success).toBe(false)
    if (!result?.success) {
      expect(result.error.issues[0].message).toBe('Please choose a country')
    }
  })
})

// ─── RadioGroup ──────────────────────────────────────────────────────────────

describe('buildFieldSchema – RadioGroup', () => {
  const base: FieldConfig = {
    name: 'size',
    type: FieldDataType.Text,
    ui: { label: 'Size', widget: WidgetType.RadioGroup },
    options: [
      { value: 's', label: 'Small' },
      { value: 'm', label: 'Medium' },
    ],
  }

  it('should accept a valid option value when required', () => {
    const field = { ...base, validation: { required: true as const } }
    expect(parse(field, 's')?.success).toBe(true)
  })

  it('should reject invalid option value', () => {
    expect(parse(base, 'xl')?.success).toBe(false)
  })

  it('should allow undefined when not required', () => {
    expect(parse(base, undefined)?.success).toBe(true)
  })
})

// ─── DatePicker ──────────────────────────────────────────────────────────────

describe('buildFieldSchema – DatePicker', () => {
  const base: FieldConfig = {
    name: 'start',
    type: FieldDataType.DateTime,
    ui: { label: 'Start', widget: WidgetType.DatePicker },
    validation: { required: true },
  }

  it('should accept a valid ISO date string', () => {
    expect(parse(base, '2025-06-15')?.success).toBe(true)
  })

  it('should reject an invalid date string', () => {
    const result = parse(base, 'not-a-date')
    expect(result?.success).toBe(false)
  })

  it('should allow undefined when not required', () => {
    const field = { ...base, validation: {} }
    expect(parse(field, undefined)?.success).toBe(true)
  })

  it('should enforce minDate', () => {
    const field = { ...base, validation: { required: true, minDate: '2025-01-01' } }
    expect(parse(field, '2024-12-31')?.success).toBe(false)
    expect(parse(field, '2025-01-01')?.success).toBe(true)
  })

  it('should enforce maxDate', () => {
    const field = { ...base, validation: { required: true, maxDate: '2025-12-31' } }
    expect(parse(field, '2026-01-01')?.success).toBe(false)
    expect(parse(field, '2025-12-31')?.success).toBe(true)
  })

  it('should use custom minDate message', () => {
    const field = {
      ...base,
      validation: { required: true, minDate: { value: '2025-01-01', message: 'Too early' } },
    }
    const result = parse(field, '2024-01-01')
    expect(result?.success).toBe(false)
    if (!result?.success) {
      expect(result.error.issues[0].message).toBe('Too early')
    }
  })
})

// ─── Number ──────────────────────────────────────────────────────────────────

describe('buildFieldSchema – Number', () => {
  const base: FieldConfig = {
    name: 'age',
    type: FieldDataType.Integer,
    ui: { label: 'Age', widget: WidgetType.Number },
    validation: { required: true, min: 1, max: 120 },
  }

  it('should accept a value within range', () => {
    expect(parse(base, 25)?.success).toBe(true)
  })

  it('should reject a value below min', () => {
    expect(parse(base, 0)?.success).toBe(false)
  })

  it('should reject a value above max', () => {
    expect(parse(base, 200)?.success).toBe(false)
  })

  it('should coerce numeric string to number', () => {
    expect(parse(base, '42')?.success).toBe(true)
  })

  it('should allow no value when not required', () => {
    const field = { ...base, validation: { min: 1, max: 120 } }
    expect(parse(field, undefined)?.success).toBe(true)
  })

  it('should use custom min/max messages', () => {
    const field = {
      ...base,
      validation: {
        required: true,
        min: { value: 18, message: 'Must be at least 18' },
        max: { value: 65, message: 'Must be at most 65' },
      },
    }
    const tooLow = parse(field, 5)
    expect(tooLow?.success).toBe(false)
    if (!tooLow?.success) {
      expect(tooLow.error.issues[0].message).toBe('Must be at least 18')
    }
  })
})

// ─── Input / Text ─────────────────────────────────────────────────────────────

describe('buildFieldSchema – Input/Text', () => {
  const base: FieldConfig = {
    name: 'bio',
    type: FieldDataType.Text,
    ui: { label: 'Bio', widget: WidgetType.Input },
    validation: { required: true },
  }

  it('should accept a non-empty string when required', () => {
    expect(parse(base, 'Hello')?.success).toBe(true)
  })

  it('should reject empty string when required', () => {
    expect(parse(base, '')?.success).toBe(false)
  })

  it('should use custom required message', () => {
    const field = { ...base, validation: { required: 'Bio is mandatory' } }
    const result = parse(field, '')
    expect(result?.success).toBe(false)
    if (!result?.success) {
      expect(result.error.issues[0].message).toBe('Bio is mandatory')
    }
  })

  it('should enforce minLength', () => {
    const field = { ...base, validation: { required: true, minLength: 5 } }
    expect(parse(field, 'Hi')?.success).toBe(false)
    expect(parse(field, 'Hello world')?.success).toBe(true)
  })

  it('should enforce maxLength', () => {
    const field = { ...base, validation: { required: true, maxLength: 5 } }
    expect(parse(field, 'Hello world')?.success).toBe(false)
    expect(parse(field, 'Hi')?.success).toBe(true)
  })

  it('should enforce email validation', () => {
    const field = { ...base, validation: { required: true, email: true } }
    expect(parse(field, 'not-an-email')?.success).toBe(false)
    expect(parse(field, 'user@example.com')?.success).toBe(true)
  })

  it('should use custom email message', () => {
    const field = { ...base, validation: { required: true, email: 'Bad email' } }
    const result = parse(field, 'foo')
    expect(result?.success).toBe(false)
    if (!result?.success) {
      expect(result.error.issues[0].message).toBe('Bad email')
    }
  })

  it('should enforce pattern validation', () => {
    const field = { ...base, validation: { required: true, pattern: '^[0-9]+$' } }
    expect(parse(field, 'abc')?.success).toBe(false)
    expect(parse(field, '12345')?.success).toBe(true)
  })

  it('should use custom pattern message', () => {
    const field = {
      ...base,
      validation: { required: true, pattern: { value: '^[0-9]+$', message: 'Digits only' } },
    }
    const result = parse(field, 'abc')
    expect(result?.success).toBe(false)
    if (!result?.success) {
      expect(result.error.issues[0].message).toBe('Digits only')
    }
  })

  it('should return null when no validation config is provided', () => {
    const field: FieldConfig = {
      name: 'notes',
      type: FieldDataType.Text,
      ui: { label: 'Notes', widget: WidgetType.Input },
    }
    expect(buildFieldSchema(field)).toBeNull()
  })
})

// ─── Textarea ─────────────────────────────────────────────────────────────────

describe('buildFieldSchema – Textarea', () => {
  it('should accept valid text with minLength/maxLength', () => {
    const field: FieldConfig = {
      name: 'notes',
      type: FieldDataType.Text,
      ui: { label: 'Notes', widget: WidgetType.Textarea },
      validation: { required: true, minLength: 10, maxLength: 200 },
    }
    expect(parse(field, 'short')?.success).toBe(false)
    expect(parse(field, 'This is long enough text.')?.success).toBe(true)
  })
})
