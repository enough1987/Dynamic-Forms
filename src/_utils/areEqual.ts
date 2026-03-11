import type { FieldFormState } from '@/contracts/form.types'

type WithFormStateAndField = { formState: FieldFormState; field: unknown; disabled?: boolean }

/**
 * Shallow equality check used as the `arePropsEqual` argument for `React.memo`
 * in widget components. Re-renders are skipped unless the field config object
 * itself changes, or any of the three pieces of Formik state (value, touched,
 * error) differ from the previous render, or the `disabled` prop changes.
 *
 * Note: `field` comparison uses referential equality (`===`), which works
 * because field config objects come from a stable config and don't change
 * between renders unless the entire FormConfig is replaced.
 */
export function areEqual(prev: WithFormStateAndField, next: WithFormStateAndField): boolean {
  return (
    prev.field === next.field &&
    prev.disabled === next.disabled &&
    prev.formState.value === next.formState.value &&
    prev.formState.touched === next.formState.touched &&
    prev.formState.error === next.formState.error
  )
}
