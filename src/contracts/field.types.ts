import type { FieldDataType, InputType, WidgetType } from './enums'
import type { ValidationConfig } from '@/contracts/validation.types'

export type JsonLogicRule = Record<string, unknown>

export type FieldLogic = {
  visibleIf?: JsonLogicRule
}

export type FieldOption = {
  value: string | number
  label: string
  logic?: FieldLogic
}

type BaseUi = {
  label: string
  placeholder?: string
  helpText?: string
}

export type InputUi = BaseUi & { widget: WidgetType.Input; inputType?: InputType; pattern?: string }
export type TextareaUi = BaseUi & { widget: WidgetType.Textarea }
export type SelectUi = BaseUi & { widget: WidgetType.Select }
export type NumberUi = BaseUi & { widget: WidgetType.Number }
export type DatePickerUi = BaseUi & { widget: WidgetType.DatePicker }
export type CheckboxUi = BaseUi & { widget: WidgetType.Checkbox }
export type RadioGroupUi = BaseUi & { widget: WidgetType.RadioGroup }

type BaseField = {
  name: string
  type: FieldDataType
  defaultValue?: string | number | boolean
  validation?: ValidationConfig
  logic?: FieldLogic
}

export type InputFieldConfig = BaseField & { ui: InputUi }
export type TextareaFieldConfig = BaseField & { ui: TextareaUi }
export type SelectFieldConfig = BaseField & { ui: SelectUi; options: FieldOption[] }
export type NumberFieldConfig = BaseField & { ui: NumberUi }
export type DatePickerFieldConfig = BaseField & { ui: DatePickerUi }
export type CheckboxFieldConfig = BaseField & { ui: CheckboxUi }
export type RadioGroupFieldConfig = BaseField & { ui: RadioGroupUi; options: FieldOption[] }

export type FieldConfig =
  | InputFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | NumberFieldConfig
  | DatePickerFieldConfig
  | CheckboxFieldConfig
  | RadioGroupFieldConfig

export type FormConfig = {
  id: string
  title: string
  fields: FieldConfig[]
}
