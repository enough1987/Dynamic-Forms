import './App.css'
import { lazy, Suspense } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const FormExamples = lazy(() =>
  import('@/pages/FormExamples').then((m) => ({ default: m.FormExamples as React.ComponentType }))
)

function App(): React.JSX.Element {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4} sx={{ mx: 'auto', mt: 6 }}>
        <Typography variant="h4" component="h1">DynamicForm</Typography>
        <Suspense fallback={<CircularProgress />}>
          <FormExamples />
        </Suspense>
      </Stack>
    </LocalizationProvider>
  )
}

export { App }
