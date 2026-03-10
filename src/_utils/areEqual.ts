import type { FieldFormState } from '@/contracts/form.types'

type WithFormStateAndField = { formState: FieldFormState; field: unknown }

export function areEqual(prev: WithFormStateAndField, next: WithFormStateAndField): boolean {
  return (
    prev.field === next.field &&
    prev.formState.value === next.formState.value &&
    prev.formState.touched === next.formState.touched &&
    prev.formState.error === next.formState.error
  )
}
