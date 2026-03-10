import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SelectWidget } from '../index'
import { FieldDataType, WidgetType } from '@/contracts/enums'
import type { SelectFieldConfig } from '@/contracts/field.types'
import { makeFormState } from '@/test/utils'

const field: SelectFieldConfig = {
  name: 'region',
  type: FieldDataType.Text,
  ui: { label: 'Region', widget: WidgetType.Select },
  options: [
    { value: 'europe', label: 'Europe' },
    { value: 'americas', label: 'The Americas' },
    { value: 'asia', label: 'Asia Pacific' },
  ],
}

describe('SelectWidget', () => {
  it('should render the label', () => {
    render(<SelectWidget field={field} formState={makeFormState()} />)
    // MUI Select renders the label twice (InputLabel + legend), use getByLabelText to avoid ambiguity
    expect(screen.getByRole('combobox', { name: /Region/ })).toBeInTheDocument()
  })

  it('should render a combobox role element', () => {
    render(<SelectWidget field={field} formState={makeFormState()} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('should show the selected value label when a value is set', () => {
    render(<SelectWidget field={field} formState={makeFormState({ value: 'europe' })} />)
    expect(screen.getByText('Europe')).toBeInTheDocument()
  })

  it('should mark as required when validation.required is set', () => {
    const requiredField: SelectFieldConfig = { ...field, validation: { required: true } }
    render(<SelectWidget field={requiredField} formState={makeFormState()} />)
    // MUI marks the input as required
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-required', 'true')
  })

  it('should not show required attribute when not required', () => {
    render(<SelectWidget field={field} formState={makeFormState()} />)
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-required', 'true')
  })

  it('should apply error state when touched and error present', () => {
    const formState = makeFormState({ touched: true, error: 'Region is required' })
    render(<SelectWidget field={field} formState={formState} />)
    // MUI Select with error adds aria-invalid
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('should not apply error state when not touched', () => {
    const formState = makeFormState({ touched: false, error: 'Region is required' })
    render(<SelectWidget field={field} formState={formState} />)
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid', 'true')
  })
})
