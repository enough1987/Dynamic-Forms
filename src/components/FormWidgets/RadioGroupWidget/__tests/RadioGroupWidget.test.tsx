import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RadioGroupWidget } from '../index'
import { FieldDataType, WidgetType } from '@/contracts/enums'
import type { RadioGroupFieldConfig } from '@/contracts/field.types'
import { makeFormState } from '@/test/utils'

const field: RadioGroupFieldConfig = {
  name: 'priority',
  type: FieldDataType.Text,
  ui: { label: 'Priority', widget: WidgetType.RadioGroup },
  options: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ],
}

describe('RadioGroupWidget', () => {
  it('should render the group label', () => {
    render(<RadioGroupWidget field={field} formState={makeFormState()} />)
    expect(screen.getByText('Priority')).toBeInTheDocument()
  })

  it('should render all option labels', () => {
    render(<RadioGroupWidget field={field} formState={makeFormState()} />)
    expect(screen.getByLabelText('Low')).toBeInTheDocument()
    expect(screen.getByLabelText('Medium')).toBeInTheDocument()
    expect(screen.getByLabelText('High')).toBeInTheDocument()
  })

  it('should render the selected radio button as checked', () => {
    render(<RadioGroupWidget field={field} formState={makeFormState({ value: 'medium' })} />)
    expect(screen.getByLabelText('Medium')).toBeChecked()
    expect(screen.getByLabelText('Low')).not.toBeChecked()
  })

  it('should call onChange when an option is selected', () => {
    const onChange = vi.fn()
    render(<RadioGroupWidget field={field} formState={makeFormState({ onChange })} />)
    fireEvent.click(screen.getByLabelText('High'))
    expect(onChange).toHaveBeenCalled()
  })

  it('should call onBlur when focus is lost', () => {
    const onBlur = vi.fn()
    render(<RadioGroupWidget field={field} formState={makeFormState({ onBlur })} />)
    fireEvent.blur(screen.getByLabelText('Low'))
    expect(onBlur).toHaveBeenCalled()
  })

  it('should show error message when touched and error present', () => {
    const formState = makeFormState({ touched: true, error: 'Please select an option' })
    render(<RadioGroupWidget field={field} formState={formState} />)
    expect(screen.getByText('Please select an option')).toBeInTheDocument()
  })

  it('should not show error when not touched', () => {
    const formState = makeFormState({ touched: false, error: 'Please select an option' })
    render(<RadioGroupWidget field={field} formState={formState} />)
    expect(screen.queryByText('Please select an option')).not.toBeInTheDocument()
  })

  it('should render only provided options', () => {
    const filtered: RadioGroupFieldConfig = {
      ...field,
      options: [{ value: 'low', label: 'Low' }],
    }
    render(<RadioGroupWidget field={filtered} formState={makeFormState()} />)
    expect(screen.getByLabelText('Low')).toBeInTheDocument()
    expect(screen.queryByText('Medium')).not.toBeInTheDocument()
    expect(screen.queryByText('High')).not.toBeInTheDocument()
  })
})
