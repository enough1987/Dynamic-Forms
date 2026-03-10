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
  const hasFieldLogic = Boolean(field.logic)
  const hasOptionLogic = 'options' in field && field.options.some((o) => o.logic)
  if (!hasFieldLogic && !hasOptionLogic) return

  const visible = evaluateLogic(field.logic?.visibleIf, values)

  if (!visible) {
    if (values[field.name] === initialValues[field.name]) return
    void setFieldValue(field.name, initialValues[field.name])
    void setFieldTouched(field.name, false, false)
    return
  }

  const isChoiceWidget = field.ui.widget === WidgetType.Select || field.ui.widget === WidgetType.RadioGroup
  if (!isChoiceWidget || !('options' in field)) return

  const current = values[field.name]
  if (current === '' || current === initialValues[field.name]) return

  const visibleOptions = field.options.filter((opt) => evaluateLogic(opt.logic?.visibleIf, values))
  const stillValid = visibleOptions.some((opt) => String(opt.value) === String(current))
  if (stillValid) return

  void setFieldValue(field.name, initialValues[field.name])
  void setFieldTouched(field.name, false, false)
}
