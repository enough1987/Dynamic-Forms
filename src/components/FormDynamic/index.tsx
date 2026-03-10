import { useEffect } from 'react'
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

type FormDynamicProps = {
  config: FormConfig
  onSubmit?: (values: FormValues) => void
  submitLabel?: string
}

export function FormDynamic({ config, onSubmit, submitLabel = 'Submit' }: FormDynamicProps) {
  const initialValues = buildInitialValues(config.fields)

  const handleValidate = (values: FormValues) => validate(config.fields, values)

  const formik = useFormik<FormValues>({
    initialValues,
    enableReinitialize: true,
    validate: handleValidate,
    onSubmit: (values, helpers) => {
      const visibleFields = config.fields.filter((f) =>
        evaluateLogic(f.logic?.visibleIf, values),
      )
      const visibleNames = new Set(visibleFields.map((f) => f.name))
      const filtered = Object.fromEntries(
        Object.entries(values).filter(([k]) => visibleNames.has(k)),
      )
      try {
        onSubmit?.(filtered)
      } finally {
        helpers.setSubmitting(false)
      }
    },
  })

  // Reset hidden fields, and reset select/radio fields whose current value is no longer in visible options
  useEffect(() => {
    const handlers = { setFieldValue: formik.setFieldValue, setFieldTouched: formik.setFieldTouched }
    for (const field of config.fields) {
      syncFieldState(field, formik.values, initialValues, handlers)
    }
  }, [formik.values])

  const fields = renderFields(config.fields, formik)

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      noValidate
      autoComplete="off"
    >
      <Stack spacing={3}>
        <Typography variant="h5">{config.title}</Typography>
        {fields}
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
        >
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  )
}
