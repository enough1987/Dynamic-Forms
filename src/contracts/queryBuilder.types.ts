import type { FormConfig } from './field.types'

export interface Message {
  text: string
  timestamp: Date
}

export type QueryItem = { id: string; type: 'message'; data: Message } | { id: string; type: 'table'; data: FormConfig }
