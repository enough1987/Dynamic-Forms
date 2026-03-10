import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InputTextWidget } from '../index'
import { FieldDataType, InputType, WidgetType } from '@/contracts/enums'
import type { InputFieldConfig } from '@/contracts/field.types'
import { makeFormState } from '@/test/utils'

const field: InputFieldConfig = {
  name: 'full_name',
  type: FieldDataType.Text,
  ui: { label: 'Full Name', widget: WidgetType.Input, placeholder: 'Enter name…' },
}

describe('InputTextWidget', () => {
  it('should render the label', () => {
    render(<InputTextWidget field={field} formState={makeFormState()} />)
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
  })

  it('should render with the current value', () => {
    render(<InputTextWidget field={field} formState={makeFormState({ value: 'Alice' })} />)
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument()
  })

  it('should call onChange when user types', () => {
    const onChange = vi.fn()
    render(<InputTextWidget field={field} formState={makeFormState({ onChange })} />)
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Bob' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('should call onBlur when field loses focus', () => {
    const onBlur = vi.fn()
    render(<InputTextWidget field={field} formState={makeFormState({ onBlur })} />)
    fireEvent.blur(screen.getByLabelText('Full Name'))
    expect(onBlur).toHaveBeenCalled()
  })

  it('should show error helper text when touched and error present', () => {
    const formState = makeFormState({ touched: true, error: 'Name is required' })
    render(<InputTextWidget field={field} formState={formState} />)
    expect(screen.getByText('Name is required')).toBeInTheDocument()
  })

  it('should show help text when no error', () => {
    const helpField: InputFieldConfig = {
      ...field,
      ui: { ...field.ui, helpText: 'Your full legal name' },
    }
    render(<InputTextWidget field={helpField} formState={makeFormState()} />)
    expect(screen.getByText('Your full legal name')).toBeInTheDocument()
  })

  it('should not show error when not touched', () => {
    const formState = makeFormState({ touched: false, error: 'Name is required' })
    render(<InputTextWidget field={field} formState={formState} />)
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
  })

  it('should use the specified inputType', () => {
    const emailField: InputFieldConfig = {
      ...field,
      ui: { ...field.ui, inputType: InputType.Email },
    }
    render(<InputTextWidget field={emailField} formState={makeFormState()} />)
    expect(screen.getByLabelText('Full Name')).toHaveAttribute('type', 'email')
  })

  it('should default to type text when no inputType specified', () => {
    render(<InputTextWidget field={field} formState={makeFormState()} />)
    expect(screen.getByLabelText('Full Name')).toHaveAttribute('type', 'text')
  })

  it('should mark field as required when validation.required is set', () => {
    const requiredField: InputFieldConfig = {
      ...field,
      validation: { required: true },
    }
    render(<InputTextWidget field={requiredField} formState={makeFormState()} />)
    expect(screen.getByLabelText(/Full Name/)).toHaveAttribute('required')
  })
})
