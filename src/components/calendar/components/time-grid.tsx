import { CalendarEvent } from '../types'
import { cn } from '@/lib/utils'

interface TimeGridProps {
  events: CalendarEvent[]
  startHour?: number
  endHour?: number
  timeFormat?: '12h' | '24h'
  className?: string
  onEventClick?: (event: CalendarEvent) => void
}

export function TimeGrid({
  events,
  startHour = 0,
  endHour = 24,
  timeFormat = '24h',
  className,
  onEventClick
}: TimeGridProps) {
  const formatTime = (hour: number) => {
    if (timeFormat === '12h') {
      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:00 ${period}`
    }
    return `${hour.toString().padStart(2, '0')}:00`
  }

  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i)

  return (
    <div className={cn("grid grid-cols-[60px_1fr] gap-1", className)}>
      {hours.map((hour) => (
        <div key={hour} className="grid grid-cols-[60px_1fr] col-span-2 min-h-[48px]">
          <div className="text-sm text-muted-foreground p-2 text-right pr-4">
            {formatTime(hour)}
          </div>
          <div className="border border-border rounded-sm hover:bg-accent/50 transition-colors" />
        </div>
      ))}
    </div>
  )
} 