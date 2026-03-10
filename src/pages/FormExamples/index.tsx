import { useState } from 'react'
import Box from '@mui/material/Box'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { FormDynamic } from '@/components/FormDynamic'
import { formConfig, formConfig2, formConfig3 } from '@/mocks/formConfig.mock'
import type { FormValues } from '@/components/FormDynamic/utils/buildInitialValues'

const configs = { '1': formConfig, '2': formConfig2, '3': formConfig3 }

export function FormExamples(): React.JSX.Element {
  const [selected, setSelected] = useState<'1' | '2' | '3'>('1')
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null)

  const handleSubmit = (values: FormValues): void => {
    setSubmittedValues(values)
  }

  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 4, px: 2 }}>
      <FormControl sx={{ mb: 3 }}>
        <FormLabel>Form Config</FormLabel>
        <RadioGroup
          row
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value as '1' | '2' | '3')
            setSubmittedValues(null)
          }}
        >
          <FormControlLabel value="1" control={<Radio />} label="Config 1 — Sprint Team Assignment" />
          <FormControlLabel value="2" control={<Radio />} label="Config 2 — Shipping Location" />
          <FormControlLabel value="3" control={<Radio />} label="Config 3 — Passenger Details" />
        </RadioGroup>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: '0 0 70%' }}>
          <FormDynamic key={selected} config={configs[selected]} onSubmit={handleSubmit} />
        </Box>

        <Box sx={{ flex: '0 0 calc(30% - 24px)', display: 'flex', flexDirection: 'column' }}>
          {submittedValues !== null ? (
            <Paper variant="outlined" sx={{ p: 2, flex: 1, minHeight: '30vh', overflow: 'auto' }}>
              <Typography variant="subtitle2" gutterBottom>
                Submitted values
              </Typography>
              <Box component="pre" sx={{ m: 0, fontSize: 13, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {JSON.stringify(submittedValues, null, 2)}
              </Box>
            </Paper>
          ) : (
            <Paper variant="outlined" sx={{ p: 2, flex: 1, minHeight: '30vh' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Submitted values will appear here.
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  )
}
