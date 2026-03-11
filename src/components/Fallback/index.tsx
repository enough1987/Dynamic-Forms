import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import type React from 'react'

function Fallback(): React.JSX.Element {
  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  )
}

export { Fallback }
