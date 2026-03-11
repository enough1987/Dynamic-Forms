import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { NavLink } from 'react-router-dom'
import { ROUTING } from '@/contracts/navTabs'

export function AppNav(): React.JSX.Element {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Tabs value={false}>
        {ROUTING.map((tab) => (
          <Tab
            key={tab.to}
            label={tab.label}
            component={NavLink}
            to={tab.to}
            end
            sx={{
              '&.active': { color: 'primary.main', fontWeight: 600 },
            }}
          />
        ))}
      </Tabs>
    </Box>
  )
}
