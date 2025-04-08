'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from '@/lib/utils'
import { Check, ChevronLeft, ChevronRight, ChevronDown, Filter, CalendarDays, Calendar as CalendarIcon, Clock, CalendarRange, ChevronUp } from 'lucide-react'
import { useCalendar } from './hooks/use-calendar'
import { DayCell } from './components/day-cell'
import { CalendarProps, DayData, CalendarView, TimeFormat, CalendarEvent, EventDisplay } from './types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { WeekView } from './components/week-view'
import { DayView } from './components/day-view'
import { mockCompanies, mockUsers, User, Company } from './mock-data'

export function Calendar({
  initialView = 'month',
  initialDate = new Date(),
  initialTimeFormat = '24h',
  onEventAdd,
  onDateSelect,
  onEventEdit,
  onEventDelete,
  className,
  events = [],
  editable = true,
  selectable = true,
  selectMirror = false,
  dayMaxEvents = 3,
  eventMaxStack = 3,
  eventDisplay = 'block' as EventDisplay,
  currentUser = mockUsers[0] // Varsayılan olarak super admin
}: CalendarProps & { currentUser?: User }) {
  const calendarRef = useRef<HTMLDivElement>(null)
  const {
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
  } = useCalendar({
    initialView,
    initialDate,
    initialTimeFormat,
    events,
    editable,
    selectable,
    selectMirror,
    dayMaxEvents: typeof dayMaxEvents === 'number' ? dayMaxEvents : undefined,
    eventMaxStack,
    eventDisplay
  })

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({})
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(currentUser.role === 'super_admin' ? mockCompanies[0].id : currentUser.companyId || null)

  const isDayData = (item: Date | DayData): item is DayData => {
    return 'isCurrentMonth' in item
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  const handleEventAdd = (date: Date) => {
    if (!editable) return
    setSelectedDate(date)
    setIsAddingEvent(true)
    setNewEvent({
      startDate: date,
      endDate: date,
      type: 'other',
      companyId: currentUser.role === 'super_admin' ? '' : currentUser.companyId!
    })
  }

  const handleSaveEvent = () => {
    if (newEvent.title && newEvent.startDate && newEvent.endDate && newEvent.type) {
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title!,
        description: newEvent.description || '',
        startDate: newEvent.startDate!,
        endDate: newEvent.endDate!,
        type: newEvent.type!,
        companyId: currentUser.role === 'super_admin' ? selectedCompanyId! : currentUser.companyId!
      }
      onEventAdd?.(event)
      setIsAddingEvent(false)
      setNewEvent({})
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewEvent(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEvent(prev => ({ ...prev, [name]: new Date(value) }))
  }

  const handleEventEdit = (event: CalendarEvent) => {
    if (onEventEdit) {
      onEventEdit(event)
    }
    setIsEditDialogOpen(false)
    setSelectedDate(null)
  }

  // Firma bazlı event filtreleme
  const filteredEvents = events.filter(event => {
    if (currentUser.role === 'super_admin') {
      return event.companyId === selectedCompanyId
    }
    return event.companyId === currentUser.companyId
  })

  const weekDays = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']

  return (
    <div className={cn("flex flex-col gap-3 h-full", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Navigasyon Butonları */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => {
              prev()
              calendarRef.current?.classList.add('animate-calendar-slide-prev')
              setTimeout(() => {
                calendarRef.current?.classList.remove('animate-calendar-slide-prev')
              }, 300)
            }}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Ay Seçici */}
            <Select
              value={currentDate.getMonth().toString()}
              onValueChange={(value) => {
                const newDate = new Date(currentDate)
                newDate.setMonth(parseInt(value))
                newDate.setDate(1)
                const direction = parseInt(value) > currentDate.getMonth() ? 'next' : 'prev'
                setCurrentDate(newDate)
                calendarRef.current?.classList.add('animate-calendar-slide-' + direction)
                setTimeout(() => {
                  calendarRef.current?.classList.remove('animate-calendar-slide-' + direction)
                }, 300)
              }}
            >
              <SelectTrigger className="w-[140px] font-medium">
                <SelectValue>
                  {currentDate.toLocaleString('tr-TR', { month: 'long' })}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => new Date(currentDate.getFullYear(), i, 1)).map((date) => (
                  <SelectItem
                    key={date.getMonth()}
                    value={date.getMonth().toString()}
                  >
                    {date.toLocaleString('tr-TR', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Yıl Seçici */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-[80px] font-medium justify-center"
                >
                  {currentDate.getFullYear()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[80px] p-2" align="start">
                <div className="flex flex-col items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      const newDate = new Date(currentDate)
                      newDate.setFullYear(currentDate.getFullYear() + 1)
                      setCurrentDate(newDate)
                      calendarRef.current?.classList.add('animate-calendar-slide-next')
                      setTimeout(() => {
                        calendarRef.current?.classList.remove('animate-calendar-slide-next')
                      }, 300)
                    }}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <div className="text-lg font-medium py-1">
                    {currentDate.getFullYear()}
                  </div>
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      const newDate = new Date(currentDate)
                      newDate.setFullYear(currentDate.getFullYear() - 1)
                      setCurrentDate(newDate)
                      calendarRef.current?.classList.add('animate-calendar-slide-prev')
                      setTimeout(() => {
                        calendarRef.current?.classList.remove('animate-calendar-slide-prev')
                      }, 300)
                    }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="icon" onClick={() => {
              next()
              calendarRef.current?.classList.add('animate-calendar-slide-next')
              setTimeout(() => {
                calendarRef.current?.classList.remove('animate-calendar-slide-next')
              }, 300)
            }}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Firma Seçici (Sadece super admin için) */}
          {currentUser.role === 'super_admin' && (
            <div className="ml-4 border-l pl-4">
              <Select
                value={selectedCompanyId || ''}
                onValueChange={(value) => setSelectedCompanyId(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Firma Seçin" />
                </SelectTrigger>
                <SelectContent>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Saat Formatı */}
          <Select value={timeFormat} onValueChange={(value: TimeFormat) => changeTimeFormat(value)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12h">12 Saat</SelectItem>
              <SelectItem value="24h">24 Saat</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtre */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px]">
              <div className="space-y-2">
                <div className="font-medium">Event Türleri</div>
                <div className="space-y-1">
                  <Button variant="outline" className="w-full justify-start">
                    <Check className="mr-2 h-4 w-4" />
                    Düğün
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Check className="mr-2 h-4 w-4" />
                    Nişan
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Check className="mr-2 h-4 w-4" />
                    Kına
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Check className="mr-2 h-4 w-4" />
                    Diğer
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Bu Ay Butonu */}
          <Button variant="outline" onClick={today}>
            Bu Ay
          </Button>

          {/* Görünüm Seçici */}
          <div className="border rounded-md p-1 flex gap-1">
            <Button
              variant={currentView === 'day' ? 'secondary' : 'ghost'}
              className={cn(
                "px-3 flex items-center gap-2",
                currentView === 'day' ? "w-24" : "w-10"
              )}
              onClick={() => changeView('day')}
            >
              <Clock className="h-4 w-4" />
              {currentView === 'day' && <span>Gün</span>}
            </Button>
            <Button
              variant={currentView === 'week' ? 'secondary' : 'ghost'}
              className={cn(
                "px-3 flex items-center gap-2",
                currentView === 'week' ? "w-24" : "w-10"
              )}
              onClick={() => changeView('week')}
            >
              <CalendarRange className="h-4 w-4" />
              {currentView === 'week' && <span>Hafta</span>}
            </Button>
            <Button
              variant={currentView === 'month' ? 'secondary' : 'ghost'}
              className={cn(
                "px-3 flex items-center gap-2",
                currentView === 'month' ? "w-24" : "w-10"
              )}
              onClick={() => changeView('month')}
            >
              <CalendarIcon className="h-4 w-4" />
              {currentView === 'month' && <span>Ay</span>}
            </Button>
          </div>

          {/* Yeni Etkinlik Butonu */}
          <Button onClick={() => setIsAddingEvent(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            + Yeni Etkinlik
          </Button>
        </div>
      </div>

      <Card className="p-3 shadow-md flex-1 overflow-hidden">
        <div ref={calendarRef} className="h-full">
          {currentView === 'month' && (
            <div className="h-full flex flex-col overflow-hidden animate-in fade-in-50 duration-300 ease-in-out">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 px-1 mb-1">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-muted-foreground h-6 flex items-center justify-center"
                  >
                    {day}
                  </div>
                ))}
              </div>
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1 flex-1">
                {viewData.map((day, index) => {
                  if (!isDayData(day)) return null
                  return (
                    <DayCell
                      key={index}
                      day={{
                        ...day,
                        events: day.events.filter(event => {
                          if (currentUser.role === 'super_admin') {
                            return event.companyId === selectedCompanyId
                          }
                          return event.companyId === currentUser.companyId
                        })
                      }}
                      onEventAdd={handleEventAdd}
                      onDateSelect={handleDateSelect}
                      onEventEdit={handleEventEdit}
                      onEventDelete={onEventDelete}
                      editable={editable}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {currentView === 'week' && (
            <div className="h-full animate-in fade-in-50 duration-300 ease-in-out">
              <WeekView
                days={viewData.filter(isDayData) as DayData[]}
                events={filteredEvents.filter(event => {
                  const eventWeekStart = new Date(currentDate);
                  eventWeekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1);
                  const eventWeekEnd = new Date(eventWeekStart);
                  eventWeekEnd.setDate(eventWeekStart.getDate() + 6);
                  
                  return new Date(event.startDate) >= eventWeekStart && 
                         new Date(event.startDate) <= eventWeekEnd;
                })}
                timeFormat={timeFormat}
                onEventClick={(event) => {
                  if (onEventEdit) {
                    setSelectedDate(event.startDate)
                    setNewEvent(event)
                    setIsEditDialogOpen(true)
                  }
                }}
              />
            </div>
          )}

          {currentView === 'day' && (
            <div className="h-full animate-in fade-in-50 duration-300 ease-in-out">
              <DayView
                date={currentDate}
                events={filteredEvents.filter(event => {
                  const eventDate = new Date(event.startDate);
                  return eventDate.getDate() === currentDate.getDate() &&
                         eventDate.getMonth() === currentDate.getMonth() &&
                         eventDate.getFullYear() === currentDate.getFullYear();
                })}
                timeFormat={timeFormat}
                onEventClick={(event) => {
                  if (onEventEdit) {
                    setSelectedDate(event.startDate)
                    setNewEvent(event)
                    setIsEditDialogOpen(true)
                  }
                }}
              />
            </div>
          )}
        </div>
      </Card>

      <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event for {newEvent.startDate instanceof Date ? newEvent.startDate.toLocaleDateString() : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Firma Seçici (Sadece super admin için) */}
            {currentUser.role === 'super_admin' && (
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Select
                  value={newEvent.companyId || ''}
                  onValueChange={(value) => setNewEvent({ ...newEvent, companyId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={newEvent.title || ''}
                onChange={handleInputChange}
                placeholder="Enter event title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={newEvent.type || ''}
                onValueChange={(value) => setNewEvent({ ...newEvent, type: value as CalendarEvent['type'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newEvent.description || ''}
                onChange={handleInputChange}
                placeholder="Enter event description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={newEvent.startDate ? new Date(newEvent.startDate).toISOString().slice(0, 16) : ''}
                onChange={handleDateChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={newEvent.endDate ? new Date(newEvent.endDate).toISOString().slice(0, 16) : ''}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEvent}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Edit event for {selectedDate?.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={newEvent.title || ''}
                onChange={handleInputChange}
                placeholder="Enter event title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={newEvent.type || ''}
                onValueChange={(value) => setNewEvent({ ...newEvent, type: value as CalendarEvent['type'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="henna">Henna</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newEvent.description || ''}
                onChange={handleInputChange}
                placeholder="Enter event description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={newEvent.startDate ? new Date(newEvent.startDate).toISOString().slice(0, 16) : ''}
                onChange={handleDateChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={newEvent.endDate ? new Date(newEvent.endDate).toISOString().slice(0, 16) : ''}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                if (onEventDelete && newEvent.id) {
                  onEventDelete(newEvent as CalendarEvent)
                }
                setIsEditDialogOpen(false)
                setNewEvent({})
              }}
            >
              Delete
            </Button>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setNewEvent({})
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (newEvent.id && onEventEdit) {
                onEventEdit(newEvent as CalendarEvent)
              }
              setIsEditDialogOpen(false)
              setNewEvent({})
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}