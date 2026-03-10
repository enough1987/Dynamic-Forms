import { vi } from 'vitest'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import type { FieldFormState } from '@/contracts/form.types'
import type { ReactNode } from 'react'

export function makeFormState(overrides: Partial<FieldFormState> = {}): FieldFormState {
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

export function withLocalizationProvider(ui: ReactNode) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {ui}
    </LocalizationProvider>
  )
}
