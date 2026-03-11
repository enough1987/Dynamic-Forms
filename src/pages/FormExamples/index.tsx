import { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { FormDynamic } from '@/components/FormDynamic'
import { formConfig, formConfig2, formConfig3 } from '@/mocks/formConfig.mock'
import type { FormValues } from '@/components/FormDynamic/utils/buildInitialValues'
import type { FormConfig } from '@/contracts/field.types'

type ConfigKey = '1' | '2' | '3'
type Selected = ConfigKey | 'custom'

const configs: Record<ConfigKey, FormConfig> = {
  '1': formConfig,
  '2': formConfig2,
  '3': formConfig3,
}

export function FormExamples(): React.JSX.Element {
  const [selected, setSelected] = useState<Selected>('1')
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null)
  const [customText, setCustomText] = useState<string>('')
  const [customConfig, setCustomConfig] = useState<FormConfig | null>(null)
  const [customError, setCustomError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeConfig: FormConfig | null = selected === 'custom' ? customConfig : configs[selected]

  const handleSelect = (next: Selected): void => {
    if (next === 'custom') {
      setCustomText('')
      setCustomConfig(null)
      setCustomError(null)
    }
    setSelected(next)
    setSubmittedValues(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev): void => {
      const text = ev.target?.result as string
      setCustomText(text)
      setCustomError(null)
      try {
        const parsed = JSON.parse(text) as FormConfig
        setCustomConfig(parsed)
        setSubmittedValues(null)
      } catch (err) {
        setCustomError(err instanceof Error ? err.message : 'Invalid JSON')
        setCustomConfig(null)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleSubmit = (values: FormValues): void => {
    setSubmittedValues(values)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ flexShrink: 0, px: 2, pt: 4, pb: 2, bgcolor: 'background.default', zIndex: 10 }}>
        <FormControl>
          <FormLabel>Form Config</FormLabel>
          <RadioGroup
            row
            value={selected}
            onChange={(e) => {
              handleSelect(e.target.value as Selected)
            }}
          >
            <FormControlLabel value="1" control={<Radio />} label="Config 1 — Sprint Team Assignment" />
            <FormControlLabel value="2" control={<Radio />} label="Config 2 — Shipping Location" />
            <FormControlLabel value="3" control={<Radio />} label="Config 3 — Passenger Details" />
            <FormControlLabel value="custom" control={<Radio />} label="Custom — paste your own config" />
          </RadioGroup>
        </FormControl>
      </Box>

      <Box sx={{ flex: '1 1 0', overflow: 'auto', px: 2, pt: 2, pb: '5%' }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'stretch', minHeight: '100%' }}>
          <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
            {activeConfig && <FormDynamic config={activeConfig} onSubmit={handleSubmit} />}
            {submittedValues && (
              <Box component="pre" sx={{ m: 0, mt: 2, fontSize: 13, overflow: 'auto', flex: '1 1 0' }}>
                {JSON.stringify(submittedValues, null, 2)}
              </Box>
            )}
          </Box>

          <Box sx={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Paper variant="outlined" sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {selected === 'custom' ? (
                <>
                  <Box
                    component="input"
                    type="file"
                    accept=".json,application/json"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    sx={{ display: 'none' }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Choose JSON file…
                  </Button>
                  {customError && (
                    <Typography variant="caption" color="error">
                      {customError}
                    </Typography>
                  )}
                  <Box
                    component="pre"
                    sx={{ m: 0, fontSize: 13, overflow: 'auto', flex: '1 1 0', opacity: customConfig ? 1 : 0.4 }}
                  >
                    {customText || 'No file loaded yet…'}
                  </Box>
                </>
              ) : (
                <Box component="pre" sx={{ m: 0, fontSize: 13, overflow: 'auto', flex: '1 1 0' }}>
                  {JSON.stringify(configs[selected], null, 2)}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
