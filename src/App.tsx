import './App.css'
import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box'
import { Fallback } from '@/components/Fallback'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AppNav } from '@/components/AppNav'
import { ROUTING } from '@/contracts/navTabs'

function App(): React.JSX.Element {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <AppNav />
          <Box sx={{ flex: '1 1 0', overflow: 'auto' }}>
            <Suspense fallback={<Fallback />}>
              <Routes>
                {ROUTING.map((tab) => (
                  <Route key={tab.to} path={tab.to} element={<tab.element />} />
                ))}
              </Routes>
            </Suspense>
          </Box>
        </Box>
      </BrowserRouter>
    </LocalizationProvider>
  )
}

export { App }
