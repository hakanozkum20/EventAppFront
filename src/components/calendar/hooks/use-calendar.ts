import { useState, useMemo } from 'react'
import { CalendarView, DayData, TimeFormat, UseCalendarProps, UseCalendarReturn, CalendarEvent, EventDisplay } from '../types'

export function useCalendar({
  initialView = 'month',
  initialDate = new Date(),
  initialTimeFormat = '24h',
  events = [],
  editable = true,
  selectable = true,
  selectMirror = false,
  dayMaxEvents = 3,
  eventMaxStack = 3,
  eventDisplay = 'block' as EventDisplay
}: UseCalendarProps): UseCalendarReturn {
  const [currentView, setCurrentView] = useState<CalendarView>(initialView)
  const [currentDate, setCurrentDate] = useState<Date>(initialDate)
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(initialTimeFormat)

  // Yardımcı fonksiyon: İki tarihin aynı gün olup olmadığını kontrol eder
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const formatDate = (date: Date, format: 'short' | 'long' = 'short'): string => {
    return date.toLocaleDateString('tr-TR', {
      month: format === 'short' ? 'short' : 'long',
      day: 'numeric',
      weekday: format === 'long' ? 'long' : undefined
    })
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('tr-TR', {
      hour: timeFormat === '12h' ? 'numeric' : '2-digit',
      minute: '2-digit',
      hour12: timeFormat === '12h'
    })
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    return today.getTime() === compareDate.getTime()
  }

  // Belirli bir güne ait eventları filtreler
  const getEventsForDay = (date: Date): CalendarEvent[] => {
    return events.filter((event) => {
      const eventStartDate = new Date(event.startDate)
      const eventEndDate = new Date(event.endDate)
      const targetDate = new Date(date)
      
      // Tarihleri saat bilgisini sıfırlayarak karşılaştır
      eventStartDate.setHours(0, 0, 0, 0)
      eventEndDate.setHours(0, 0, 0, 0)
      targetDate.setHours(0, 0, 0, 0)
      
      // Tarihleri timestamp'e çevirerek karşılaştır
      const targetTimestamp = targetDate.getTime()
      const startTimestamp = eventStartDate.getTime()
      const endTimestamp = eventEndDate.getTime()
      
      return targetTimestamp >= startTimestamp && targetTimestamp <= endTimestamp
    })
  }

  const getMonthData = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Ayın ilk ve son günleri
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()

    // Ayın ilk gününün haftanın hangi gününe denk geldiğini bul (0: Pazar, 1: Pazartesi, ...)
    let startDay = firstDayOfMonth.getDay()
    
    // Pazartesi'den başlayacak şekilde düzelt
    // Pazar günü için (0 -> 6), diğer günler için bir gün geri al
    startDay = startDay === 0 ? 6 : startDay - 1

    // Önceki ayın son gününü bul
    const prevMonthLastDay = new Date(year, month, 0).getDate()

    const days: (Date | DayData)[] = []

    // 1. Önceki ayın günlerini ekle
    for (let i = startDay - 1; i >= 0; i--) {
      const prevMonthDay = prevMonthLastDay - i
      const date = new Date(year, month - 1, prevMonthDay)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        events: getEventsForDay(date)
      })
    }

    // 2. Mevcut ayın günlerini ekle
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isToday(date),
        events: getEventsForDay(date)
      })
    }

    // 3. Sonraki ayın günlerini ekle
    const totalDaysNeeded = 42 // 6 hafta * 7 gün
    const remainingDays = totalDaysNeeded - days.length
    
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        events: getEventsForDay(date)
      })
    }

    return days
  }

  const getWeekData = () => {
    const weekStart = new Date(currentDate)
    weekStart.setDate(currentDate.getDate() - currentDate.getDay()) // Pazar'dan başla
    const days: (Date | DayData)[] = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      const dayEvents = getEventsForDay(date)

      days.push({
        date,
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
        isToday: isToday(date),
        events: dayEvents
      })
    }

    return days
  }

  const getDayData = () => {
    const hours: Date[] = []
    for (let i = 0; i < 24; i++) {
      const date = new Date(currentDate)
      date.setHours(i)
      hours.push(date)
    }
    return hours
  }

  // Görünüm verilerini hesapla
  const viewData = useMemo(() => {
    switch (currentView) {
      case 'month':
        return getMonthData()
      case 'week':
        return getWeekData()
      case 'day':
        return getDayData()
      default:
        return getMonthData()
    }
  }, [currentView, currentDate, events])

  const next = () => {
    const newDate = new Date(currentDate)
    switch (currentView) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case 'week':
        newDate.setDate(newDate.getDate() + 7)
        break
      case 'day':
        newDate.setDate(newDate.getDate() + 1)
        break
    }
    setCurrentDate(newDate)
  }

  const prev = () => {
    const newDate = new Date(currentDate)
    switch (currentView) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case 'week':
        newDate.setDate(newDate.getDate() - 7)
        break
      case 'day':
        newDate.setDate(newDate.getDate() - 1)
        break
    }
    setCurrentDate(newDate)
  }

  const today = () => {
    setCurrentDate(new Date())
  }

  const changeView = (view: CalendarView) => {
    setCurrentView(view)
  }

  const changeTimeFormat = (format: TimeFormat) => {
    setTimeFormat(format)
  }

  return {
    currentView,
    currentDate,
    timeFormat,
    viewData,
    formatDate,
    formatTime,
    next,
    prev,
    today,
    changeView,
    changeTimeFormat,
    setCurrentDate
  }
} 