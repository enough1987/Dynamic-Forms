import { describe, it, expect, vi } from 'vitest'
import { areEqual } from '../areEqual'
import type { FieldFormState } from '@/contracts/form.types'

function makeFormState(overrides: Partial<FieldFormState> = {}): FieldFormState {
  return {
    value: '',
    touched: false,
    error: undefined,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    setFieldValue: vi.fn(),
    setFieldTouched: vi.fn(),
    ...overrides,
  }
}

describe('areEqual', () => {
  it('should return true when field reference, value, touched, and error are identical', () => {
    const field = { name: 'foo' }
    const formState = makeFormState({ value: 'hello', touched: true, error: undefined })
    expect(areEqual({ formState, field }, { formState, field })).toBe(true)
  })

  it('should return false when field reference changes', () => {
    const formState = makeFormState()
    expect(
      areEqual({ formState, field: { name: 'a' } }, { formState, field: { name: 'a' } }),
    ).toBe(false)
  })

  it('should return false when value changes', () => {
    const field = { name: 'foo' }
    const prev = makeFormState({ value: 'old' })
    const next = makeFormState({ value: 'new' })
    expect(areEqual({ formState: prev, field }, { formState: next, field })).toBe(false)
  })

  it('should return false when touched changes', () => {
    const field = { name: 'foo' }
    const prev = makeFormState({ touched: false })
    const next = makeFormState({ touched: true })
    expect(areEqual({ formState: prev, field }, { formState: next, field })).toBe(false)
  })

  it('should return false when error changes', () => {
    const field = { name: 'foo' }
    const prev = makeFormState({ error: undefined })
    const next = makeFormState({ error: 'Required' })
    expect(areEqual({ formState: prev, field }, { formState: next, field })).toBe(false)
  })

  it('should handle numeric value comparison', () => {
    const field = { name: 'qty' }
    const formState = makeFormState({ value: 42 })
    expect(areEqual({ formState, field }, { formState, field })).toBe(true)
  })

  it('should handle boolean value comparison', () => {
    const field = { name: 'accept' }
    const formState = makeFormState({ value: true })
    expect(areEqual({ formState, field }, { formState, field })).toBe(true)
  })
})
