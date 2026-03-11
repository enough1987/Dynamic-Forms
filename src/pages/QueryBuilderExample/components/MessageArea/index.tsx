import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Message } from '@/contracts/queryBuilder.types'

interface MessageAreaProps {
  message: Message | null
}

export function MessageArea({ message }: MessageAreaProps): React.JSX.Element {
  return (
    <Box sx={{ p: 2 }}>
      <Box>
        {message && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.75 }}>
            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                py: 0.25,
                borderRadius: 3,
                bgcolor: 'background.paper',
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'divider',
                fontSize: '0.72rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '80%',
                display: 'block',
              }}
            >
              {message.text}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.45, fontSize: '0.65rem', flexShrink: 0 }}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
