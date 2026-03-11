import { useEffect, useMemo } from 'react'
import { useFormik } from 'formik'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { FormConfig } from '@/contracts/field.types'
import { buildInitialValues, type FormValues } from '@/components/FormDynamic/utils/buildInitialValues'
import { validate } from '@/components/FormDynamic/utils/validate'
import { renderFields } from '@/components/FormDynamic/utils/renderFields'
import { syncFieldState } from '@/components/FormDynamic/utils/syncFieldState'
import { evaluateLogic } from '@/_utils/evaluateLogic'
import { FormStyleType } from '@/contracts/enums'

type FormDynamicProps = {
  config: FormConfig
  onSubmit?: (values: FormValues) => void
  onChange?: (values: FormValues) => void
  submitLabel?: string
  styleType?: FormStyleType
  disabled?: boolean
}

export function FormDynamic({
  config,
  onSubmit,
  onChange,
  submitLabel = 'Submit',
  styleType,
  disabled,
}: FormDynamicProps): React.JSX.Element {
  // Derive initial values from the field config so the form always starts in a known state.
  // useMemo keeps the reference stable so it can safely be listed in the useEffect dep array below.
  const initialValues = useMemo(() => buildInitialValues(config.fields), [config.fields])

  const handleValidate = (values: FormValues): Record<string, string> => validate(config.fields, values)

  const formik = useFormik<FormValues>({
    initialValues,
    // Re-initialise the form when `config` changes (e.g. user loads a different form)
    enableReinitialize: true,
    validate: handleValidate,
    onSubmit: (values, helpers) => {
      // Strip hidden fields from the submission — they may hold stale values
      // that should not be sent to the caller
      const visibleFields = config.fields.filter((f) => evaluateLogic(f.logic?.visibleIf, values))
      const visibleNames = new Set(visibleFields.map((f) => f.name))
      const filtered = Object.fromEntries(Object.entries(values).filter(([k]) => visibleNames.has(k)))
      try {
        onSubmit?.(filtered)
      } finally {
        helpers.setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    onChange?.(formik.values)
  }, [onChange, formik.values])

  // Reset hidden fields, and reset select/radio fields whose current value is no longer in visible options
  useEffect(() => {
    const handlers = { setFieldValue: formik.setFieldValue, setFieldTouched: formik.setFieldTouched }
    for (const field of config.fields) {
      syncFieldState(field, formik.values, initialValues, handlers)
    }
  }, [config.fields, formik.setFieldTouched, formik.setFieldValue, formik.values, initialValues])

  const fields = renderFields(config.fields, formik, styleType, disabled)
  const isOptionsStyleType = styleType === FormStyleType.Options

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate autoComplete="off">
      <Stack spacing={isOptionsStyleType ? 0 : 3}>
        {!isOptionsStyleType && <Typography variant="h5">{config.title}</Typography>}
        {isOptionsStyleType ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 240px)', gap: 1, alignItems: 'start' }}>
            {fields}
          </Box>
        ) : (
          fields
        )}
        {onSubmit && (
          <Button
            type="submit"
            variant={isOptionsStyleType ? 'outlined' : 'contained'}
            size="small"
            disabled={formik.isSubmitting || !formik.isValid || !formik.dirty || disabled}
            sx={
              isOptionsStyleType ? { width: 120, mt: 1, bgcolor: 'background.paper', fontSize: '0.75rem' } : undefined
            }
          >
            {submitLabel}
          </Button>
        )}
      </Stack>
    </Box>
  )
}
