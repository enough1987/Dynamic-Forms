import type { FormikHandlers, FormikHelpers } from 'formik'

export type FormValues = Record<string, string | number | boolean>

export type FieldFormState = {
  value: string | number | boolean
  touched: boolean
  error: string | undefined
  onChange: FormikHandlers['handleChange']
  onBlur: FormikHandlers['handleBlur']
  setFieldValue: FormikHelpers<FormValues>['setFieldValue']
  setFieldTouched: FormikHelpers<FormValues>['setFieldTouched']
}
