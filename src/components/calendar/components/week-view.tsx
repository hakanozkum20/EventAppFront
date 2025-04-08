import { CalendarEvent, DayData } from '../types'
import { TimeGrid } from './time-grid'
import { cn } from '@/lib/utils'

interface WeekViewProps {
  days: DayData[]
  events: CalendarEvent[]
  timeFormat?: '12h' | '24h'
  className?: string
  onEventClick?: (event: CalendarEvent) => void
}

export function WeekView({
  days,
  events,
  timeFormat = '24h',
  className,
  onEventClick
}: WeekViewProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      weekday: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b">
        <div className="p-4" /> {/* Boş köşe hücresi */}
        {days.map((day) => (
          <div
            key={day.date.toISOString()}
            className={cn(
              "text-center p-4 font-medium",
              day.isToday && "bg-primary/10 rounded-t-lg"
            )}
          >
            {formatDate(day.date)}
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-[1px]">
          {Array.from({ length: 24 }).map((_, hour) => (
            <div key={hour} className="contents">
              <div className="text-sm text-muted-foreground p-2 text-right pr-4">
                {timeFormat === '24h'
                  ? `${hour.toString().padStart(2, '0')}:00`
                  : `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`}
              </div>
              {days.map((day) => (
                <div
                  key={`${day.date.toISOString()}-${hour}`}
                  className={cn(
                    "border border-border min-h-[48px] hover:bg-accent/50 transition-colors",
                    day.isToday && "bg-primary/5"
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 