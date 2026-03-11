import { useState, useRef, useCallback, useLayoutEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Divider from '@mui/material/Divider'
import SendIcon from '@mui/icons-material/Send'
import { generateId } from '@/_utils/generateId'
import queryBuilderConfig from '@/mocks/queryBuilder.json'
import queryBuilderConfig1 from '@/mocks/queryBuilder1.json'
import queryBuilderConfig2 from '@/mocks/queryBuilder2.json'
import queryBuilderConfig3 from '@/mocks/queryBuilder3.json'
import queryBuilderConfig4 from '@/mocks/queryBuilder4.json'
import queryBuilderConfig5 from '@/mocks/queryBuilder5.json'
import type { FormValues } from '@/components/FormDynamic/utils/buildInitialValues'
import type { FormConfig } from '@/contracts/field.types'
import { MessageArea } from './components/MessageArea'
import type { QueryItem } from '@/contracts/queryBuilder.types'
import { FormDynamic } from '@/components/FormDynamic'
import { FormStyleType } from '@/contracts/enums'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

const queryBuilderConfigs = [
  queryBuilderConfig,
  queryBuilderConfig1,
  queryBuilderConfig2,
  queryBuilderConfig3,
  queryBuilderConfig4,
  queryBuilderConfig5,
]

export function QueryBuilderExample(): React.JSX.Element {
  const [items, setItems] = useState<QueryItem[]>([])
  const [input, setInput] = useState('')
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({})
  const [activeTableId, setActiveTableId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  const sendMessage = useCallback((): void => {
    const text = input.trim()
    if (!text) return

    setItems((prev) => {
      const tableCount = prev.filter((i) => i.type === 'table').length
      const config = queryBuilderConfigs[tableCount % queryBuilderConfigs.length] as FormConfig
      const tableId = generateId()
      setActiveTableId(tableId)
      return [
        { id: tableId, type: 'table', data: config },
        { id: generateId(), type: 'message', data: { text, timestamp: new Date() } },
        ...prev,
      ]
    })
    setInput('')
  }, [input])

  const handleSubmit = (): void => {
    setItems((prev) => {
      const tableCount = prev.filter((i) => i.type === 'table').length
      const config = queryBuilderConfigs[tableCount % queryBuilderConfigs.length] as FormConfig
      const tableId = generateId()
      setActiveTableId(tableId)
      return [{ id: tableId, type: 'table', data: config }, ...prev]
    })
  }

  useLayoutEffect(() => {
    topRef.current?.scrollIntoView()
  }, [items])

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleFormValues = useCallback((values: FormValues): void => {
    const incoming = Object.fromEntries(
      Object.entries(values)
        .filter(([, v]) => v !== '' && v !== false && v !== null)
        .map(([k, v]) => [k, String(v)]),
    )
    setSelectedValues((prev) => ({ ...prev, ...incoming }))
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
            placeholder="Type a message… (Enter to send)"
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
          {items.map((item) => {
            if (item.type === 'message') {
              return <MessageArea key={item.id} message={item.data} />
            } else if (item.type === 'table') {
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
