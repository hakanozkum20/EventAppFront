import { CalendarEvent } from '../types'
import { TimeGrid } from './time-grid'
import { cn } from '@/lib/utils'

interface DayViewProps {
  date: Date
  events: CalendarEvent[]
  timeFormat?: '12h' | '24h'
  className?: string
  onEventClick?: (event: CalendarEvent) => void
}

export function DayView({
  date,
  events,
  timeFormat = '24h',
  className,
  onEventClick
}: DayViewProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="text-center py-4 font-medium">
        {formatDate(date)}
      </div>
      <div className="flex-1 overflow-y-auto">
        <TimeGrid
          events={events}
          timeFormat={timeFormat}
          onEventClick={onEventClick}
        />
      </div>
    </div>
  )
} 