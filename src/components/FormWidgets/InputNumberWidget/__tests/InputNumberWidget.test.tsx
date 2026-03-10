import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InputNumberWidget } from '../index'
import { FieldDataType, WidgetType } from '@/contracts/enums'
import type { NumberFieldConfig } from '@/contracts/field.types'
import { makeFormState } from '@/test/utils'

const field: NumberFieldConfig = {
  name: 'team_size',
  type: FieldDataType.Integer,
  ui: { label: 'Team Size', widget: WidgetType.Number, helpText: 'Min 3, max 12.' },
  validation: { required: true, min: 3, max: 12 },
}

describe('InputNumberWidget', () => {
  it('should render the label', () => {
    render(<InputNumberWidget field={field} formState={makeFormState()} />)
    // Use regex because the required field adds an asterisk to the label text
    expect(screen.getByLabelText(/Team Size/)).toBeInTheDocument()
  })

  it('should render with type number', () => {
    render(<InputNumberWidget field={field} formState={makeFormState()} />)
    expect(screen.getByLabelText(/Team Size/)).toHaveAttribute('type', 'number')
  })

  it('should show current value', () => {
    render(<InputNumberWidget field={field} formState={makeFormState({ value: 5 })} />)
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
  })

  it('should call onChange when value changes', () => {
    const onChange = vi.fn()
    render(<InputNumberWidget field={field} formState={makeFormState({ onChange })} />)
    fireEvent.change(screen.getByLabelText(/Team Size/), { target: { value: '7' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('should call onBlur on blur', () => {
    const onBlur = vi.fn()
    render(<InputNumberWidget field={field} formState={makeFormState({ onBlur })} />)
    fireEvent.blur(screen.getByLabelText(/Team Size/))
    expect(onBlur).toHaveBeenCalled()
  })

  it('should show error when touched and error present', () => {
    const formState = makeFormState({ touched: true, error: 'Minimum value is 3' })
    render(<InputNumberWidget field={field} formState={formState} />)
    expect(screen.getByText('Minimum value is 3')).toBeInTheDocument()
  })

  it('should show help text when no error', () => {
    render(<InputNumberWidget field={field} formState={makeFormState()} />)
    expect(screen.getByText('Min 3, max 12.')).toBeInTheDocument()
  })

  it('should not show error when not touched', () => {
    const formState = makeFormState({ touched: false, error: 'Minimum value is 3' })
    render(<InputNumberWidget field={field} formState={formState} />)
    expect(screen.queryByText('Minimum value is 3')).not.toBeInTheDocument()
  })

  it('should block "e" key to prevent scientific notation', () => {
    render(<InputNumberWidget field={field} formState={makeFormState()} />)
    const input = screen.getByLabelText(/Team Size/)
    const event = new KeyboardEvent('keydown', { key: 'e', bubbles: true, cancelable: true })
    input.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('should block "E" key', () => {
    render(<InputNumberWidget field={field} formState={makeFormState()} />)
    const input = screen.getByLabelText(/Team Size/)
    const event = new KeyboardEvent('keydown', { key: 'E', bubbles: true, cancelable: true })
    input.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('should block "+" key', () => {
    render(<InputNumberWidget field={field} formState={makeFormState()} />)
    const input = screen.getByLabelText(/Team Size/)
    const event = new KeyboardEvent('keydown', { key: '+', bubbles: true, cancelable: true })
    input.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('should block "-" key', () => {
    render(<InputNumberWidget field={field} formState={makeFormState()} />)
    const input = screen.getByLabelText(/Team Size/)
    const event = new KeyboardEvent('keydown', { key: '-', bubbles: true, cancelable: true })
    input.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('should not block digit keys', () => {
    render(<InputNumberWidget field={field} formState={makeFormState()} />)
    const input = screen.getByLabelText(/Team Size/)
    const event = new KeyboardEvent('keydown', { key: '5', bubbles: true, cancelable: true })
    input.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })
})
