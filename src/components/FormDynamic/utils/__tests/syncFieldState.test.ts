import { describe, it, expect, vi } from 'vitest'
import { syncFieldState } from '../syncFieldState'
import { FieldDataType, WidgetType } from '@/contracts/enums'
import type { FieldConfig } from '@/contracts/field.types'

function makeHandlers() {
  return {
    setFieldValue: vi.fn(),
    setFieldTouched: vi.fn(),
  }
}

const baseInput: FieldConfig = {
  name: 'notes',
  type: FieldDataType.Text,
  ui: { label: 'Notes', widget: WidgetType.Input },
}

describe('syncFieldState', () => {
  it('should do nothing when field has no logic and no option logic', () => {
    const h = makeHandlers()
    syncFieldState(baseInput, { notes: 'hello' }, { notes: '' }, h)
    expect(h.setFieldValue).not.toHaveBeenCalled()
    expect(h.setFieldTouched).not.toHaveBeenCalled()
  })

  it('should reset field to initial value when it becomes hidden', () => {
    const field: FieldConfig = {
      ...baseInput,
      logic: { visibleIf: { '>=': [{ var: 'team_size' }, 8] } },
    }
    const h = makeHandlers()
    // team_size < 8 → hidden, but value is 'some text' (not initial '')
    syncFieldState(field, { notes: 'some text', team_size: 3 }, { notes: '' }, h)
    expect(h.setFieldValue).toHaveBeenCalledWith('notes', '')
    expect(h.setFieldTouched).toHaveBeenCalledWith('notes', false, false)
  })

  it('should not reset field when it is hidden but already at initial value', () => {
    const field: FieldConfig = {
      ...baseInput,
      logic: { visibleIf: { '>=': [{ var: 'team_size' }, 8] } },
    }
    const h = makeHandlers()
    syncFieldState(field, { notes: '', team_size: 3 }, { notes: '' }, h)
    expect(h.setFieldValue).not.toHaveBeenCalled()
  })

  it('should do nothing when field is visible and has no option logic', () => {
    const field: FieldConfig = {
      ...baseInput,
      logic: { visibleIf: { '>=': [{ var: 'team_size' }, 8] } },
    }
    const h = makeHandlers()
    syncFieldState(field, { notes: 'hello', team_size: 10 }, { notes: '' }, h)
    expect(h.setFieldValue).not.toHaveBeenCalled()
  })

  it('should reset select field when selected value is no longer in visible options', () => {
    const field: FieldConfig = {
      name: 'country',
      type: FieldDataType.Text,
      ui: { label: 'Country', widget: WidgetType.Select },
      options: [
        {
          value: 'fr',
          label: 'France',
          logic: { visibleIf: { '==': [{ var: 'region' }, 'europe'] } },
        },
        {
          value: 'us',
          label: 'United States',
          logic: { visibleIf: { '==': [{ var: 'region' }, 'americas'] } },
        },
      ],
    }
    const h = makeHandlers()
    // region switched from 'europe' to 'americas', but country is still 'fr'
    syncFieldState(
      field,
      { country: 'fr', region: 'americas' },
      { country: '' },
      h,
    )
    expect(h.setFieldValue).toHaveBeenCalledWith('country', '')
    expect(h.setFieldTouched).toHaveBeenCalledWith('country', false, false)
  })

  it('should not reset select field when selected value is still valid', () => {
    const field: FieldConfig = {
      name: 'country',
      type: FieldDataType.Text,
      ui: { label: 'Country', widget: WidgetType.Select },
      options: [
        {
          value: 'fr',
          label: 'France',
          logic: { visibleIf: { '==': [{ var: 'region' }, 'europe'] } },
        },
        {
          value: 'us',
          label: 'United States',
          logic: { visibleIf: { '==': [{ var: 'region' }, 'americas'] } },
        },
      ],
    }
    const h = makeHandlers()
    syncFieldState(
      field,
      { country: 'fr', region: 'europe' },
      { country: '' },
      h,
    )
    expect(h.setFieldValue).not.toHaveBeenCalled()
  })

  it('should not reset choice field when current value is empty string', () => {
    const field: FieldConfig = {
      name: 'city',
      type: FieldDataType.Text,
      ui: { label: 'City', widget: WidgetType.Select },
      options: [
        {
          value: 'paris',
          label: 'Paris',
          logic: { visibleIf: { '==': [{ var: 'country' }, 'fr'] } },
        },
      ],
    }
    const h = makeHandlers()
    syncFieldState(field, { city: '', country: 'de' }, { city: '' }, h)
    expect(h.setFieldValue).not.toHaveBeenCalled()
  })
})
