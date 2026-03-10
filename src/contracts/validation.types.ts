export type ValidationConfig = {
  required?: boolean | string
  email?: boolean | string
  min?: number | { value: number; message: string }
  max?: number | { value: number; message: string }
  minLength?: number | { value: number; message: string }
  maxLength?: number | { value: number; message: string }
  pattern?: string | { value: string; message: string }
  minDate?: string | { value: string; message: string }
  maxDate?: string | { value: string; message: string }
}
