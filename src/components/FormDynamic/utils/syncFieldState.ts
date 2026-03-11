import { WidgetType } from '@/contracts/enums'
import type { FieldConfig } from '@/contracts/field.types'
import type { FieldFormState, FormValues } from '@/contracts/form.types'
import { evaluateLogic } from '@/_utils/evaluateLogic'

type SyncHandlers = Pick<FieldFormState, 'setFieldValue' | 'setFieldTouched'>

export function syncFieldState(
  field: FieldConfig,
  values: FormValues,
  initialValues: FormValues,
  { setFieldValue, setFieldTouched }: SyncHandlers,
): void {
  // 1. Skip — field has no conditional logic at all, nothing to sync
  const hasAnyLogic = Boolean(field.logic) || ('options' in field && field.options.some((o) => o.logic))
  if (!hasAnyLogic) return

  // Evaluate top-level field visibility (e.g. visibleIf rule)
  const isVisible = evaluateLogic(field.logic?.visibleIf, values)

  // 2. Hidden field — reset to its initial value so stale data doesn't leak into the submission
  if (!isVisible) {
    // Already at initial value, no reset needed
    if (values[field.name] !== initialValues[field.name]) {
      resetField(field.name, initialValues, { setFieldValue, setFieldTouched })
    }
    return
  }

  // 3. Choice field — reset if the previously selected option is no longer visible
  // Only Select and RadioGroup widgets have option-level visibility logic
  const isChoiceWidget = field.ui.widget === WidgetType.Select || field.ui.widget === WidgetType.RadioGroup
  if (!isChoiceWidget || !('options' in field)) return

  const current = values[field.name]
  // Empty or already at default — nothing to reset
  if (current === '' || current === initialValues[field.name]) return

  // Keep only options whose own visibleIf rule passes
  const visibleOptions = field.options.filter((opt) => evaluateLogic(opt.logic?.visibleIf, values))
  // If the current selection is still among the visible options, leave it untouched
  const isStillValid = visibleOptions.some((opt) => String(opt.value) === String(current))
  if (!isStillValid) resetField(field.name, initialValues, { setFieldValue, setFieldTouched })
}

function resetField(name: string, initial: FormValues, handlers: SyncHandlers): void {
  void handlers.setFieldValue(name, initial[name])
  void handlers.setFieldTouched(name, false, false)
}
