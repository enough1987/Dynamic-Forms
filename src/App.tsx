import './App.css'
import { lazy, Suspense } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const FormExamples = lazy(() =>
  import('@/pages/FormExamples').then((m) => ({ default: m.FormExamples as React.ComponentType })),
)

function App(): React.JSX.Element {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Suspense
        fallback={
          <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        }
      >
        <FormExamples />
      </Suspense>
    </LocalizationProvider>
  )
}

export { App }
