import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CheckboxWidget } from '../index'
import { FieldDataType, WidgetType } from '@/contracts/enums'
import type { CheckboxFieldConfig } from '@/contracts/field.types'
import { makeFormState } from '@/test/utils'

const field: CheckboxFieldConfig = {
  name: 'accept',
  type: FieldDataType.Text,
  ui: { label: 'Accept Terms', widget: WidgetType.Checkbox },
}

describe('CheckboxWidget', () => {
  it('should render the label', () => {
    render(<CheckboxWidget field={field} formState={makeFormState()} />)
    expect(screen.getByText('Accept Terms')).toBeInTheDocument()
  })

  it('should render unchecked when value is false', () => {
    render(<CheckboxWidget field={field} formState={makeFormState({ value: false })} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('should render checked when value is true', () => {
    render(<CheckboxWidget field={field} formState={makeFormState({ value: true })} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('should call onChange when clicked', () => {
    const onChange = vi.fn()
    render(<CheckboxWidget field={field} formState={makeFormState({ onChange })} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalled()
  })

  it('should call onBlur when blurred', () => {
    const onBlur = vi.fn()
    render(<CheckboxWidget field={field} formState={makeFormState({ onBlur })} />)
    fireEvent.blur(screen.getByRole('checkbox'))
    expect(onBlur).toHaveBeenCalled()
  })

  it('should show error message when touched and has error', () => {
    const formState = makeFormState({ touched: true, error: 'You must accept' })
    render(<CheckboxWidget field={field} formState={formState} />)
    expect(screen.getByText('You must accept')).toBeInTheDocument()
  })

  it('should not show error when not touched', () => {
    const formState = makeFormState({ touched: false, error: 'You must accept' })
    render(<CheckboxWidget field={field} formState={formState} />)
    expect(screen.queryByText('You must accept')).not.toBeInTheDocument()
  })

  it('should show error state when required and checkbox is not checked', () => {
    // The required constraint is enforced via buildFieldSchema; here we verify
    // the widget correctly renders the error state when validation fires
    const formState = makeFormState({ value: false, touched: true, error: 'Accept Terms is required' })
    render(<CheckboxWidget field={{ ...field, validation: { required: true } }} formState={formState} />)
    expect(screen.getByText('Accept Terms is required')).toBeInTheDocument()
  })
})
