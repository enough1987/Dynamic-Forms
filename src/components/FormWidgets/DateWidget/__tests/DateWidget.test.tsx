import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DateWidget } from '../index'
import { FieldDataType, WidgetType } from '@/contracts/enums'
import type { DatePickerFieldConfig } from '@/contracts/field.types'
import { makeFormState, withLocalizationProvider } from '@/test/utils'

const field: DatePickerFieldConfig = {
  name: 'sprint_start',
  type: FieldDataType.DateTime,
  ui: { label: 'Sprint Start Date', widget: WidgetType.DatePicker },
  validation: { required: true },
}

// MUI DatePicker v8 renders spinbutton roles for date sections (Month/Day/Year),
// not a textbox. The underlying <input> is aria-hidden.

describe('DateWidget', () => {
  it('should render the date picker group with the correct label', () => {
    render(withLocalizationProvider(<DateWidget field={field} formState={makeFormState()} />))
    expect(screen.getByRole('group', { name: /Sprint Start Date/ })).toBeInTheDocument()
  })

  it('should render Month, Day, and Year spinbuttons', () => {
    render(withLocalizationProvider(<DateWidget field={field} formState={makeFormState({ value: '' })} />))
    expect(screen.getByRole('spinbutton', { name: 'Month' })).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: 'Day' })).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: 'Year' })).toBeInTheDocument()
  })

  it('should show formatted date value when value is provided', () => {
    render(
      withLocalizationProvider(
        <DateWidget field={field} formState={makeFormState({ value: '2025-06-15' })} />,
      ),
    )
    expect(screen.getByRole('spinbutton', { name: 'Month' })).toHaveAttribute('aria-valuenow', '6')
    expect(screen.getByRole('spinbutton', { name: 'Day' })).toHaveAttribute('aria-valuenow', '15')
    expect(screen.getByRole('spinbutton', { name: 'Year' })).toHaveAttribute('aria-valuenow', '2025')
  })

  it('should show error helper text when touched and error present', () => {
    const formState = makeFormState({ touched: true, error: 'Invalid date' })
    render(withLocalizationProvider(<DateWidget field={field} formState={formState} />))
    expect(screen.getByText('Invalid date')).toBeInTheDocument()
  })

  it('should show help text when no error', () => {
    const helpField: DatePickerFieldConfig = {
      ...field,
      ui: { ...field.ui, helpText: 'Pick a future date' },
    }
    render(withLocalizationProvider(<DateWidget field={helpField} formState={makeFormState()} />))
    expect(screen.getByText('Pick a future date')).toBeInTheDocument()
  })

  it('should mark the hidden input as required when validation.required is set', () => {
    const { container } = render(
      withLocalizationProvider(<DateWidget field={field} formState={makeFormState()} />),
    )
    const hiddenInput = container.querySelector('input[name="sprint_start"]')
    expect(hiddenInput).toHaveAttribute('required')
  })

  it('should render a calendar-open button', () => {
    render(withLocalizationProvider(<DateWidget field={field} formState={makeFormState()} />))
    expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument()
  })

  it('should call setFieldTouched when the date container loses focus', () => {
    const setFieldTouched = vi.fn().mockResolvedValue(undefined)
    render(
      withLocalizationProvider(
        <DateWidget field={field} formState={makeFormState({ setFieldTouched })} />,
      ),
    )
    // React normalizes onBlur to the focusout event (which bubbles)
    const month = screen.getByRole('spinbutton', { name: 'Month' })
    fireEvent.focusOut(month)
    expect(setFieldTouched).toHaveBeenCalledWith('sprint_start', true)
  })
})

