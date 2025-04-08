import { CalendarEvent } from '../types'
import { Button } from '@/components/ui/button'
import { DayData } from '../types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, ChangeEvent } from 'react'
import { Plus } from 'lucide-react'

interface DayCellProps {
  day: DayData
  onEventAdd?: (date: Date) => void
  onDateSelect?: (date: Date) => void
  onEventEdit?: (event: CalendarEvent) => void
  onEventDelete?: (event: CalendarEvent) => void
  editable?: boolean
}

export function DayCell({ 
  day, 
  onEventAdd, 
  onDateSelect, 
  onEventEdit,
  onEventDelete,
  editable = true 
}: DayCellProps) {
  const hasEvents = day.events && day.events.length > 0
  const displayedEvents = day.events?.slice(0, 3) || []
  const remainingEvents = (day.events?.length || 0) - 3
  const eventCount = displayedEvents.length
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedEvent, setEditedEvent] = useState<Partial<CalendarEvent>>({})
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({})

  const handleEventClick = (event: CalendarEvent) => {
    if (!editable) return
    setSelectedEvent(event)
    setEditedEvent(event)
    setIsEditDialogOpen(true)
  }

  const handleSave = () => {
    if (selectedEvent && editedEvent) {
      onEventEdit?.({
        ...selectedEvent,
        ...editedEvent,
      })
      setIsEditDialogOpen(false)
      setSelectedEvent(null)
      setEditedEvent({})
    }
  }

  const handleDelete = () => {
    if (selectedEvent) {
      onEventDelete?.(selectedEvent)
      setSelectedEvent(null)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedEvent(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedEvent(prev => ({ ...prev, [name]: new Date(value) }))
  }

  const handleEventEdit = (event: CalendarEvent) => {
    if (onEventEdit) {
      onEventEdit(event)
    }
    setIsEditDialogOpen(false)
  }

  const handleAddEvent = (date: Date) => {
    if (!editable) return
    onEventAdd?.(date)
  }

  const handleAddEventSubmit = () => {
    if (onEventAdd && newEvent.title && newEvent.type && newEvent.startDate && newEvent.endDate) {
      onEventAdd(new Date(newEvent.startDate))
      setIsAddDialogOpen(false)
      setNewEvent({
        title: '',
        type: 'wedding',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        description: ''
      })
    }
  }

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'wedding':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'engagement':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'henna':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const formatEventTime = (date: Date | string) => {
    const eventDate = typeof date === 'string' ? new Date(date) : date
    return eventDate.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleEventTypeChange = (value: CalendarEvent['type']) => {
    setEditedEvent((prev) => ({ ...prev!, type: value }))
  }

  const handleEventStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedEvent((prev) => ({
      ...prev!,
      startDate: new Date(e.target.value).toISOString()
    }))
  }

  const handleEventEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedEvent((prev) => ({
      ...prev!,
      endDate: new Date(e.target.value).toISOString()
    }))
  }

  const handleNewEventTypeChange = (value: CalendarEvent['type']) => {
    setNewEvent((prev) => ({ ...prev, type: value }))
  }

  const handleNewEventStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent((prev) => ({
      ...prev,
      startDate: new Date(e.target.value).toISOString()
    }))
  }

  const handleNewEventEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent((prev) => ({
      ...prev,
      endDate: new Date(e.target.value).toISOString()
    }))
  }

  return (
    <div className={`group relative min-h-[120px] border rounded-xl transition-colors ${
      day.isCurrentMonth
        ? 'bg-background text-foreground hover:border-primary/30'
        : 'bg-muted/10 text-muted-foreground'
    } ${day.isToday ? 'bg-accent/10 font-bold border-primary' : ''}`}
    onClick={() => onDateSelect?.(day.date)}
    >
      <div className="flex flex-col h-full p-2">
        {/* Gün numarası */}
        <div className={`font-semibold mb-1.5 ${day.isToday ? 'text-base' : 'text-sm'}`}>
          {day.date.getDate()}
        </div>

        {/* Event listesi */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid gap-1.5">
            {displayedEvents.map((event) => (
              <div
                key={event.id}
                className={`p-1.5 text-xs rounded-lg shadow-sm ${
                  event.type === 'wedding'
                    ? 'bg-pink-50 text-pink-700 border border-pink-200'
                    : event.type === 'engagement'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-orange-50 text-orange-700 border border-orange-200'
                } hover:shadow-md transition-shadow cursor-pointer ${
                  !editable ? 'cursor-default' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleEventClick(event)
                }}
              >
                <div className="font-medium truncate">{event.title}</div>
                <div className="text-xs opacity-75 truncate">
                  {formatEventTime(new Date(event.startDate))} - {formatEventTime(new Date(event.endDate))}
                </div>
              </div>
            ))}
            {remainingEvents > 0 && (
              <div className="text-xs text-muted-foreground text-center py-0.5">
                +{remainingEvents} daha fazla
              </div>
            )}
          </div>
        </div>

        {/* Add Event butonu - sadece event olmayan günlerde göster */}
        {!hasEvents && editable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              className="min-h-0 h-8 px-3 text-xs font-medium text-muted-foreground/60 opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-accent-foreground"
              onClick={(e) => {
                e.stopPropagation()
                handleAddEvent(day.date)
              }}
            >
              + Etkinlik Ekle
            </Button>
          </div>
        )}
      </div>

      {/* Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={() => {
        setIsEditDialogOpen(false)
        setSelectedEvent(null)
        setEditedEvent({})
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Etkinlik Detayları</DialogTitle>
            <DialogDescription>
              Etkinlik bilgilerini görüntüleyin veya düzenleyin.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Başlık
                </Label>
                <Input
                  id="title"
                  value={editedEvent?.title || selectedEvent.title}
                  onChange={(e) =>
                    setEditedEvent((prev) => ({ ...prev!, title: e.target.value }))
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Tip
                </Label>
                <Select
                  value={editedEvent?.type || selectedEvent.type}
                  onValueChange={handleEventTypeChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Düğün</SelectItem>
                    <SelectItem value="engagement">Nişan</SelectItem>
                    <SelectItem value="henna">Kına</SelectItem>
                    <SelectItem value="other">Diğer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Başlangıç
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={editedEvent?.startDate && selectedEvent.startDate 
                    ? new Date(editedEvent.startDate).toISOString().slice(0, 16) 
                    : new Date(selectedEvent.startDate).toISOString().slice(0, 16)}
                  onChange={handleEventStartDateChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  Bitiş
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={editedEvent?.endDate && selectedEvent.endDate
                    ? new Date(editedEvent.endDate).toISOString().slice(0, 16)
                    : new Date(selectedEvent.endDate).toISOString().slice(0, 16)}
                  onChange={handleEventEndDateChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Açıklama
                </Label>
                <Textarea
                  id="description"
                  value={editedEvent?.description || selectedEvent.description}
                  onChange={(e) =>
                    setEditedEvent((prev) => ({
                      ...prev!,
                      description: e.target.value,
                    }))
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSave}>Değişiklikleri Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yeni Etkinlik</DialogTitle>
            <DialogDescription>
              Yeni bir etkinlik eklemek için bilgileri doldurun.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-title" className="text-right">
                Başlık
              </Label>
              <Input
                id="new-title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-type" className="text-right">
                Tip
              </Label>
              <Select
                value={newEvent.type}
                onValueChange={handleNewEventTypeChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Düğün</SelectItem>
                  <SelectItem value="engagement">Nişan</SelectItem>
                  <SelectItem value="henna">Kına</SelectItem>
                  <SelectItem value="other">Diğer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-startDate" className="text-right">
                Başlangıç
              </Label>
              <Input
                id="new-startDate"
                type="datetime-local"
                value={newEvent.startDate ? new Date(newEvent.startDate).toISOString().slice(0, 16) : ''}
                onChange={handleNewEventStartDateChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-endDate" className="text-right">
                Bitiş
              </Label>
              <Input
                id="new-endDate"
                type="datetime-local"
                value={newEvent.endDate ? new Date(newEvent.endDate).toISOString().slice(0, 16) : ''}
                onChange={handleNewEventEndDateChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-description" className="text-right">
                Açıklama
              </Label>
              <Textarea
                id="new-description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, description: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAddEventSubmit}>Ekle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 