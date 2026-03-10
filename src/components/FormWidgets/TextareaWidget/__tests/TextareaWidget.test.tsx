import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TextareaWidget } from '../index'
import { FieldDataType, WidgetType } from '@/contracts/enums'
import type { TextareaFieldConfig } from '@/contracts/field.types'
import { makeFormState } from '@/test/utils'

const field: TextareaFieldConfig = {
  name: 'notes',
  type: FieldDataType.Text,
  ui: {
    label: 'Notes',
    widget: WidgetType.Textarea,
    placeholder: 'Enter notes…',
    helpText: 'Optional field.',
  },
}

describe('TextareaWidget', () => {
  it('should render the label', () => {
    render(<TextareaWidget field={field} formState={makeFormState()} />)
    expect(screen.getByLabelText('Notes')).toBeInTheDocument()
  })

  it('should render as a textarea element (multiline)', () => {
    render(<TextareaWidget field={field} formState={makeFormState()} />)
    // MUI multiline TextField renders a <textarea>
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0)
  })

  it('should show current value', () => {
    render(<TextareaWidget field={field} formState={makeFormState({ value: 'Some notes here' })} />)
    expect(screen.getByDisplayValue('Some notes here')).toBeInTheDocument()
  })

  it('should call onChange when typing', () => {
    const onChange = vi.fn()
    render(<TextareaWidget field={field} formState={makeFormState({ onChange })} />)
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'Hello' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('should call onBlur when focus is lost', () => {
    const onBlur = vi.fn()
    render(<TextareaWidget field={field} formState={makeFormState({ onBlur })} />)
    fireEvent.blur(screen.getByLabelText('Notes'))
    expect(onBlur).toHaveBeenCalled()
  })

  it('should show error when touched and error present', () => {
    const formState = makeFormState({ touched: true, error: 'Notes is required' })
    render(<TextareaWidget field={field} formState={formState} />)
    expect(screen.getByText('Notes is required')).toBeInTheDocument()
  })

  it('should show help text when no error', () => {
    render(<TextareaWidget field={field} formState={makeFormState()} />)
    expect(screen.getByText('Optional field.')).toBeInTheDocument()
  })

  it('should not show error when not touched', () => {
    const formState = makeFormState({ touched: false, error: 'Notes is required' })
    render(<TextareaWidget field={field} formState={formState} />)
    expect(screen.queryByText('Notes is required')).not.toBeInTheDocument()
  })

  it('should mark as required when validation.required is set', () => {
    const requiredField: TextareaFieldConfig = { ...field, validation: { required: true } }
    render(<TextareaWidget field={requiredField} formState={makeFormState()} />)
    expect(screen.getByLabelText(/Notes/)).toHaveAttribute('required')
  })
})
