import { useState, useRef, useCallback, useLayoutEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Divider from '@mui/material/Divider'
import SendIcon from '@mui/icons-material/Send'
import { generateId } from '@/_utils/generateId'
import { queryBuilderConfigs } from '@/mocks/QueryBuilderExample.mock'
import type { FormValues } from '@/components/FormDynamic/utils/buildInitialValues'
import type { FormConfig } from '@/contracts/field.types'
import { MessageArea } from './components/MessageArea'
import { QueueItemType, type QueueItem } from '@/contracts/queryBuilder.types'
import { FormDynamic } from '@/components/FormDynamic'
import { FormStyleType } from '@/contracts/enums'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

export function QueryBuilderExample(): React.JSX.Element {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [input, setInput] = useState('')
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({})
  const [activeTableId, setActiveTableId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  const sendMessage = useCallback((): void => {
    const text = input.trim()
    if (!text) return

    const tableId = generateId()
    setActiveTableId(tableId)

    setQueue((prev) => {
      const tableCount = prev.filter((i) => i.type === QueueItemType.Table).length
      const config = queryBuilderConfigs[tableCount % queryBuilderConfigs.length] as FormConfig

      return [
        { id: tableId, type: QueueItemType.Table, data: config },
        { id: generateId(), type: QueueItemType.Message, data: { text, timestamp: new Date() } },
        ...prev,
      ]
    })
    setInput('')
  }, [input])

  const handleSubmit = (): void => {
    const tableId = generateId()
    setActiveTableId(tableId)

    setQueue((prev) => {
      const tableCount = prev.filter((i) => i.type === QueueItemType.Table).length
      const config = queryBuilderConfigs[tableCount % queryBuilderConfigs.length] as FormConfig

      return [{ id: tableId, type: QueueItemType.Table, data: config }, ...prev]
    })
  }

  useLayoutEffect(() => {
    topRef.current?.scrollIntoView()
  }, [queue])

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleFormValues = useCallback((values: FormValues): void => {
    setSelectedValues((prev) => {
      const withUpdates = {
        ...prev,
        ...Object.fromEntries(
          Object.entries(values)
            .filter(([, v]) => v !== '' && v !== false && v !== null && v !== undefined)
            .map(([k, v]) => [k, String(v)]),
        ),
      }

      return Object.fromEntries(
        Object.entries(withUpdates).filter(([k]) => {
          const v = values[k]
          return v === undefined || (v !== '' && v !== false && v !== null)
        }),
      )
    })
  }, [])

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          width: '80%',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Input bar */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'background.paper',
          }}
        >
          <InputBase
            fullWidth
            multiline
            maxRows={4}
            placeholder={input}
            value={input}
            inputRef={inputRef}
            onChange={(e) => {
              setInput(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            sx={{ fontSize: 14 }}
          />
          <Divider orientation="vertical" flexItem />
          <IconButton color="primary" onClick={sendMessage} disabled={!input.trim()}>
            <SendIcon />
          </IconButton>
        </Box>

        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            overflowAnchor: 'none',
          }}
        >
          <div ref={topRef} />
          {queue.map((item) => {
            if (item.type === QueueItemType.Message) {
              return <MessageArea key={item.id} message={item.data} />
            } else if (item.type === QueueItemType.Table) {
              return (
                <Box key={item.id} sx={{ px: 2, py: 1 }}>
                  <FormDynamic
                    config={item.data}
                    onSubmit={item.id === activeTableId ? handleSubmit : undefined}
                    onChange={handleFormValues}
                    styleType={FormStyleType.Options}
                    disabled={item.id !== activeTableId}
                  />
                </Box>
              )
            }
            return null
          })}
        </Box>
      </Box>

      <Box
        sx={{
          width: '20%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          bgcolor: 'grey.50',
          px: 1.5,
          py: 2,
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
          Selected
        </Typography>
        <List>
          {Object.entries(selectedValues).map(([key, value]) => (
            <ListItem key={key}>
              <ListItemText primary={`${key}: ${value}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )
}
