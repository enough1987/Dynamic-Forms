import { useState } from 'react'
import Box from '@mui/material/Box'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { FormDynamic } from '@/components/FormDynamic'
import { formConfig, formConfig2, formConfig3 } from '@/mocks/formConfig.mock'
import type { FormValues } from '@/components/FormDynamic/utils/buildInitialValues'

const configs = { '1': formConfig, '2': formConfig2, '3': formConfig3 }

export function FormExamples() {
  const [selected, setSelected] = useState<'1' | '2' | '3'>('1')

  const handleSubmit = (values: FormValues) => {
    console.log('Form submitted:', values)
  }

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 4, px: 2 }}>
      <FormControl sx={{ mb: 3 }}>
        <FormLabel>Form Config</FormLabel>
        <RadioGroup
          row
          value={selected}
          onChange={(e) => setSelected(e.target.value as '1' | '2' | '3')}
        >
          <FormControlLabel value="1" control={<Radio />} label="Config 1 — Sprint Team Assignment" />
          <FormControlLabel value="2" control={<Radio />} label="Config 2 — Shipping Location" />
          <FormControlLabel value="3" control={<Radio />} label="Config 3 — Passenger Details" />
        </RadioGroup>
      </FormControl>

      <FormDynamic key={selected} config={configs[selected]} onSubmit={handleSubmit} />
    </Box>
  )
}
