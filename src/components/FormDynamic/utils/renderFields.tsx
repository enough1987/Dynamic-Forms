/* eslint-disable react-refresh/only-export-components */
import type { useFormik } from 'formik'
import { WidgetType } from '@/contracts/enums'
import type { FieldConfig, RadioGroupFieldConfig, SelectFieldConfig } from '@/contracts/field.types'
import { InputTextWidget } from '@/components/FormWidgets/InputTextWidget'
import { SelectWidget } from '@/components/FormWidgets/SelectWidget'
import { DateWidget } from '@/components/FormWidgets/DateWidget'
import { CheckboxWidget } from '@/components/FormWidgets/CheckboxWidget'
import { RadioGroupWidget } from '@/components/FormWidgets/RadioGroupWidget'
import { TextareaWidget } from '@/components/FormWidgets/TextareaWidget'
import { InputNumberWidget } from '@/components/FormWidgets/InputNumberWidget'
import type { FieldFormState, FormValues } from '@/contracts/form.types'
import { evaluateLogic } from '@/_utils/evaluateLogic'

/**
 * Type guard that narrows a `FieldConfig` to the specific variant whose
 * `ui.widget` matches `W`. TypeScript can't narrow on nested discriminants
 * directly, so this guard bridges that gap and eliminates the need for
 * `as XFieldConfig` casts inside `FieldRenderer`.
 */
function isWidget<W extends WidgetType>(
  field: FieldConfig,
  widget: W,
): field is Extract<FieldConfig, { ui: { widget: W } }> {
  return field.ui.widget === widget
}

type FormikInstance = ReturnType<typeof useFormik<FormValues>>

type FieldRendererProps = {
  field: FieldConfig
  formik: FormikInstance
}

/** Extracts the Formik state slice relevant to a single field into a flat `FieldFormState` object. */
function getFieldFormState(field: FieldConfig, formik: FormikInstance): FieldFormState {
  return {
    value: formik.values[field.name],
    touched: Boolean(formik.touched[field.name]),
    error: formik.errors[field.name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    setFieldValue: formik.setFieldValue,
    setFieldTouched: formik.setFieldTouched,
  }
}

/**
 * Returns a version of the field with its `options` filtered to only those
 * whose `logic.visibleIf` rule passes against the current form values.
 * Short-circuits immediately when no options have logic (the common case),
 * and returns the original field reference when nothing is filtered out —
 * both preserve referential stability and avoid unnecessary re-renders.
 */
function withFilteredOptions<F extends SelectFieldConfig | RadioGroupFieldConfig>(field: F, values: FormValues): F {
  // Fast path: no option has conditional logic, nothing to filter
  if (!field.options?.some((o) => o.logic)) return field

  const visibleOptions = field.options.filter((opt) => evaluateLogic(opt.logic?.visibleIf, values))
  // All options still visible — return original to preserve reference equality
  if (visibleOptions.length === field.options.length) return field
  return { ...field, options: visibleOptions }
}

export function FieldRenderer({ field, formik }: FieldRendererProps): React.ReactNode {
  const formState = getFieldFormState(field, formik)
  const values = formik.values

  if (isWidget(field, WidgetType.Select)) {
    const f = withFilteredOptions(field, values)
    return <SelectWidget field={f} formState={formState} />
  }
  if (isWidget(field, WidgetType.Input)) {
    return <InputTextWidget field={field} formState={formState} />
  }
  if (isWidget(field, WidgetType.DatePicker)) {
    return <DateWidget field={field} formState={formState} />
  }
  if (isWidget(field, WidgetType.Checkbox)) {
    return <CheckboxWidget field={field} formState={formState} />
  }
  if (isWidget(field, WidgetType.RadioGroup)) {
    const f = withFilteredOptions(field, values)
    return <RadioGroupWidget field={f} formState={formState} />
  }
  if (isWidget(field, WidgetType.Textarea)) {
    return <TextareaWidget field={field} formState={formState} />
  }
  if (isWidget(field, WidgetType.Number)) {
    return <InputNumberWidget field={field} formState={formState} />
  }

  return null
}

/**
 * Filters the field list by each field's `visibleIf` rule and returns an
 * array of rendered `FieldRenderer` elements. Hidden fields are excluded
 * entirely from the DOM (not just visually hidden).
 */
export function renderFields(fields: FieldConfig[], formik: FormikInstance): React.ReactNode[] {
  return fields
    .filter((field) => evaluateLogic(field.logic?.visibleIf, formik.values))
    .map((field) => <FieldRenderer key={field.name} field={field} formik={formik} />)
}
