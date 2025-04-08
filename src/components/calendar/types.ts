import { RefObject } from 'react'

export type CalendarView = 'month' | 'week' | 'day'
export type TimeFormat = '12h' | '24h'
export type EventType = 'wedding' | 'engagement' | 'henna' | 'other'
export type EventDisplay = 'block' | 'list'

export interface CalendarEvent {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  type: EventType
  companyId: string
}

export interface DayData {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
}

export interface CalendarProps {
  events?: CalendarEvent[]
  onEventAdd?: (event: CalendarEvent) => void
  onEventEdit?: (event: CalendarEvent) => void
  onEventDelete?: (event: CalendarEvent) => void
  editable?: boolean
  view?: CalendarView
  timeFormat?: TimeFormat
  eventDisplay?: EventDisplay
  className?: string
  initialView?: CalendarView
  initialDate?: Date
  initialTimeFormat?: TimeFormat
  onDateSelect?: (date: Date) => void
  selectable?: boolean
  selectMirror?: boolean
  dayMaxEvents?: boolean | number
  eventMaxStack?: number
}

export interface UseCalendarProps {
  initialView?: CalendarView
  initialDate?: Date
  initialTimeFormat?: TimeFormat
  events?: CalendarEvent[]
  editable?: boolean
  selectable?: boolean
  selectMirror?: boolean
  dayMaxEvents?: number
  eventMaxStack?: number
  eventDisplay?: EventDisplay
}

export interface UseCalendarReturn {
  currentView: CalendarView
  currentDate: Date
  timeFormat: TimeFormat
  viewData: (Date | DayData)[]
  formatDate: (date: Date, format?: 'short' | 'long') => string
  formatTime: (date: Date) => string
  next: () => void
  prev: () => void
  today: () => void
  changeView: (view: CalendarView) => void
  changeTimeFormat: (format: TimeFormat) => void
  setCurrentDate: (date: Date) => void
} 