'use client'

import { Calendar } from '@/components/calendar/calendar'
import { CalendarEvent } from '@/components/calendar/types'
import { useState, useEffect } from 'react'
import { mockEvents } from '@/components/calendar/mock-data'

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    // Mock data'yı yükle
    setEvents(mockEvents)
  }, [])

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents(prev => [...prev, event])
  }

  const handleEventEdit = (event: CalendarEvent) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e))
  }

  const handleEventDelete = (event: CalendarEvent) => {
    setEvents(prev => prev.filter(e => e.id !== event.id))
  }

  return (
    <div className="h-full p-6">
      <Calendar
        events={events}
        onEventAdd={handleEventAdd}
        onEventEdit={handleEventEdit}
        onEventDelete={handleEventDelete}
        editable={true}
        selectable={true}
        selectMirror={false}
        dayMaxEvents={3}
        eventMaxStack={3}
        eventDisplay="block"
        initialView="month"
        initialDate={new Date()}
        initialTimeFormat="24h"
      />
    </div>
  )
} 