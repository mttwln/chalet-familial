import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Plus, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Member, Reservation } from '@/lib/types'
import { toast } from 'sonner'
import { format, isSameDay, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, isAfter } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'

export default function CalendarView() {
  const [currentMember] = useKV<Member | null>('current-member', null)
  const [members] = useKV<Member[]>('members', [])
  const [reservations, setReservations] = useKV<Reservation[]>('reservations', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<string>('')
  const [numberOfPeople, setNumberOfPeople] = useState('2')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!dateRange?.from || !dateRange?.to) {
      toast.error('Veuillez sélectionner une période')
      return
    }

    if (!selectedMemberId) {
      toast.error('Veuillez sélectionner un membre')
      return
    }

    const member = (members || []).find(m => m.id === selectedMemberId)
    if (!member) return

    const hasOverlap = (reservations || []).some(r => {
      const resStart = new Date(r.startDate)
      const resEnd = new Date(r.endDate)
      return (
        (isAfter(dateRange.from!, resStart) && isBefore(dateRange.from!, resEnd)) ||
        (isAfter(dateRange.to!, resStart) && isBefore(dateRange.to!, resEnd)) ||
        (isBefore(dateRange.from!, resStart) && isAfter(dateRange.to!, resEnd))
      )
    })

    if (hasOverlap) {
      toast.error('Cette période chevauche une réservation existante')
      return
    }

    const newReservation: Reservation = {
      id: Date.now().toString(),
      memberId: member.id,
      memberName: member.name,
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
      numberOfPeople: parseInt(numberOfPeople),
      status: 'confirmed'
    }

    setReservations(current => [...(current || []), newReservation])
    toast.success('Réservation créée avec succès')
    setIsDialogOpen(false)
    setDateRange(undefined)
    setSelectedMemberId('')
    setNumberOfPeople('2')
  }

  const handleDelete = (id: string) => {
    setReservations(current => (current || []).filter(r => r.id !== id))
    toast.success('Réservation supprimée')
  }

  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getReservationsForDay = (day: Date) => {
    return (reservations || []).filter(r => {
      const start = new Date(r.startDate)
      const end = new Date(r.endDate)
      return isWithinInterval(day, { start, end }) || isSameDay(day, start) || isSameDay(day, end)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Calendrier des réservations</h2>
          <p className="text-sm text-muted-foreground">Gérez les séjours au chalet</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Nouvelle réservation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nouvelle réservation</DialogTitle>
              <DialogDescription>Réservez une période de séjour au chalet</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="member">Membre</Label>
                  <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                    <SelectTrigger id="member">
                      <SelectValue placeholder="Sélectionner un membre" />
                    </SelectTrigger>
                    <SelectContent>
                      {(members || []).map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Période de séjour</Label>
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={fr}
                    className="rounded-md border"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="people">Nombre de personnes</Label>
                  <Input
                    id="people"
                    type="number"
                    min="1"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Créer la réservation</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vue mensuelle</CardTitle>
            <CardDescription>
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              locale={fr}
              className="rounded-md border"
              modifiers={{
                reserved: daysInMonth.filter(day => getReservationsForDay(day).length > 0)
              }}
              modifiersClassNames={{
                reserved: 'bg-accent/20 font-semibold'
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Réservations</CardTitle>
            <CardDescription>Liste de toutes les réservations</CardDescription>
          </CardHeader>
          <CardContent>
            {(reservations || []).length > 0 ? (
              <div className="flex flex-col gap-3">
                {(reservations || [])
                  .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                  .map((reservation) => {
                    const member = (members || []).find(m => m.id === reservation.memberId)
                    return (
                      <div key={reservation.id} className="p-3 border border-border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {member && (
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                                  style={{ backgroundColor: member.avatarColor }}
                                >
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <p className="font-medium text-sm">{reservation.memberName}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(reservation.startDate), 'dd MMM', { locale: fr })} - {format(new Date(reservation.endDate), 'dd MMM yyyy', { locale: fr })}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {reservation.numberOfPeople} {reservation.numberOfPeople > 1 ? 'personnes' : 'personne'}
                              </Badge>
                              <Badge variant={reservation.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                                {reservation.status === 'confirmed' ? 'Confirmée' : 
                                 reservation.status === 'pending' ? 'En attente' : 'Terminée'}
                              </Badge>
                            </div>
                          </div>
                          {(currentMember?.role === 'admin' || currentMember?.id === reservation.memberId) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete(reservation.id)}
                            >
                              <X size={16} />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Aucune réservation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
