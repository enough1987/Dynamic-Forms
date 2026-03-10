import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { FormDynamic } from '../index'
import { FieldDataType, WidgetType } from '@/contracts/enums'
import type { FormConfig } from '@/contracts/field.types'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
}

function renderForm(config: FormConfig, onSubmit = vi.fn()) {
  return render(
    <Wrapper>
      <FormDynamic config={config} onSubmit={onSubmit} />
    </Wrapper>,
  )
}

// ─── Simple config ────────────────────────────────────────────────────────────

const simpleConfig: FormConfig = {
  id: 'test_form',
  title: 'Test Form',
  fields: [
    {
      name: 'full_name',
      type: FieldDataType.Text,
      ui: { label: 'Full Name', widget: WidgetType.Input },
      validation: { required: true },
    },
  ],
}

// ─── Logic config (field visible only when age >= 18) ────────────────────────

const logicConfig: FormConfig = {
  id: 'logic_form',
  title: 'Logic Form',
  fields: [
    {
      name: 'age',
      type: FieldDataType.Integer,
      ui: { label: 'Age', widget: WidgetType.Number },
      validation: { required: true, min: 1 },
    },
    {
      name: 'driving_license',
      type: FieldDataType.Text,
      ui: { label: 'Driving License Number', widget: WidgetType.Input },
      validation: { required: true },
      logic: { visibleIf: { '>=': [{ var: 'age' }, 18] } },
    },
  ],
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('FormDynamic', () => {
  it('should render the form title', () => {
    renderForm(simpleConfig)
    expect(screen.getByText('Test Form')).toBeInTheDocument()
  })

  it('should render the submit button with default label', () => {
    renderForm(simpleConfig)
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('should render custom submit label', () => {
    render(
      <Wrapper>
        <FormDynamic config={simpleConfig} submitLabel="Save" />
      </Wrapper>,
    )
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('should disable the submit button initially when form is not dirty', () => {
    renderForm(simpleConfig)
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })

  it('should disable the submit button when required field is empty after touching', async () => {
    const user = userEvent.setup()
    renderForm(simpleConfig)
    const input = screen.getByLabelText(/Full Name/)
    await user.type(input, 'a')
    await user.clear(input)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
    })
  })

  it('should enable the submit button when all required fields are filled', async () => {
    const user = userEvent.setup()
    renderForm(simpleConfig)
    await user.type(screen.getByLabelText(/Full Name/), 'Alice Chen')
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled()
    })
  })

  it('should call onSubmit with correct values when form is submitted', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    renderForm(simpleConfig, onSubmit)
    await user.type(screen.getByLabelText(/Full Name/), 'Alice Chen')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ full_name: 'Alice Chen' })
    })
  })

  it('should show validation error on submit with empty required field', async () => {
    const user = userEvent.setup()
    renderForm(simpleConfig)
    // Make the form dirty by typing then clearing
    const input = screen.getByLabelText(/Full Name/)
    await user.type(input, 'x')
    await user.clear(input)
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }).closest('form')!)
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument()
    })
  })

  it('should render all fields from the config', () => {
    renderForm(logicConfig)
    expect(screen.getByLabelText(/Age/)).toBeInTheDocument()
  })

  it('should hide conditional field when logic condition is not met', () => {
    renderForm(logicConfig)
    expect(screen.queryByLabelText(/Driving License/)).not.toBeInTheDocument()
  })

  it('should show conditional field when logic condition is met', async () => {
    const user = userEvent.setup()
    renderForm(logicConfig)
    await user.type(screen.getByLabelText(/Age/), '20')
    await waitFor(() => {
      expect(screen.getByLabelText(/Driving License/)).toBeInTheDocument()
    })
  })

  it('should not include hidden field in submitted values', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    renderForm(logicConfig, onSubmit)
    // Only fill age (below 18, so driving_license field hidden)
    await user.type(screen.getByLabelText(/Age/), '5')
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled()
    })
    await user.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.not.objectContaining({ driving_license: expect.anything() }),
      )
    })
  })
})
