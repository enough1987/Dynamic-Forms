import type { FormConfig } from './field.types'

export interface Message {
  text: string
  timestamp: Date
}

export enum QueueItemType {
  Message = 'message',
  Table = 'table',
  Suggestion = 'suggestion',
}

export type QueueItem =
  | { id: string; type: QueueItemType.Message; data: Message }
  | { id: string; type: QueueItemType.Table; data: FormConfig }
  | { id: string; type: QueueItemType.Suggestion; data: string[] }
