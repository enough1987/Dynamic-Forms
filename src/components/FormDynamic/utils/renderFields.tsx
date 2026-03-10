import { useFormik } from 'formik'
import { WidgetType } from '@/contracts/enums'
import type { CheckboxFieldConfig, DatePickerFieldConfig, FieldConfig, InputFieldConfig, NumberFieldConfig, RadioGroupFieldConfig, SelectFieldConfig, TextareaFieldConfig } from '@/contracts/field.types'
import { InputTextWidget } from '@/components/FormWidgets/InputTextWidget'
import { SelectWidget } from '@/components/FormWidgets/SelectWidget'
import { DateWidget } from '@/components/FormWidgets/DateWidget'
import { CheckboxWidget } from '@/components/FormWidgets/CheckboxWidget'
import { RadioGroupWidget } from '@/components/FormWidgets/RadioGroupWidget'
import { TextareaWidget } from '@/components/FormWidgets/TextareaWidget'
import { InputNumberWidget } from '@/components/FormWidgets/InputNumberWidget'
import type { FieldFormState, FormValues } from '@/contracts/form.types'
import { evaluateLogic } from '@/_utils/evaluateLogic'

type FormikInstance = ReturnType<typeof useFormik<FormValues>>

type FieldRendererProps = {
  field: FieldConfig
  formik: FormikInstance
}

function getFieldFormState(field: FieldConfig, formik: FormikInstance): FieldFormState {
  return {
    value: formik.values[field.name],
    touched: Boolean(formik.touched[field.name]),
    error: formik.errors[field.name] as string | undefined,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    setFieldValue: formik.setFieldValue,
    setFieldTouched: formik.setFieldTouched,
  }
}

function withFilteredOptions(
  field: SelectFieldConfig | RadioGroupFieldConfig,
  values: FormValues,
): SelectFieldConfig | RadioGroupFieldConfig {
  const visibleOptions = field.options.filter((opt) =>
    evaluateLogic(opt.logic?.visibleIf, values),
  )
  if (visibleOptions.length === field.options.length) return field
  return { ...field, options: visibleOptions }
}

export function FieldRenderer({ field, formik }: FieldRendererProps): React.ReactNode {
  const formState = getFieldFormState(field, formik)
  const widget = field.ui.widget
  const values = formik.values

  if (widget === WidgetType.Select) {
    const f = withFilteredOptions(field as SelectFieldConfig, values) as SelectFieldConfig
    return <SelectWidget field={f} formState={formState} />
  }
  if (widget === WidgetType.Input) {
    return <InputTextWidget field={field as InputFieldConfig} formState={formState} />
  }
  if (widget === WidgetType.DatePicker) {
    return <DateWidget field={field as DatePickerFieldConfig} formState={formState} />
  }
  if (widget === WidgetType.Checkbox) {
    return <CheckboxWidget field={field as CheckboxFieldConfig} formState={formState} />
  }
  if (widget === WidgetType.RadioGroup) {
    const f = withFilteredOptions(field as RadioGroupFieldConfig, values) as RadioGroupFieldConfig
    return <RadioGroupWidget field={f} formState={formState} />
  }
  if (widget === WidgetType.Textarea) {
    return <TextareaWidget field={field as TextareaFieldConfig} formState={formState} />
  }
  if (widget === WidgetType.Number) {
    return <InputNumberWidget field={field as NumberFieldConfig} formState={formState} />
  }
}

export function renderFields(
  fields: FieldConfig[],
  formik: FormikInstance,
): React.ReactNode[] {
  return fields
    .filter((field) => evaluateLogic(field.logic?.visibleIf, formik.values))
    .map((field) => <FieldRenderer key={field.name} field={field} formik={formik} />)
}
