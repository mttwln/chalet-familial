import { useStorage } from '@/hooks/useStorage'
import { Calendar, CurrencyCircleDollar, Flame, Lightning, CalendarCheck } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Reservation, ConsumptionRecord } from '@/lib/types'
import { format, isAfter, isBefore, startOfToday } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Dashboard() {
  const [reservations] = useStorage<Reservation[]>('reservations', [])
  const [consumptionRecords] = useStorage<ConsumptionRecord[]>('consumption-records', [])

  const today = startOfToday()
  
  const upcomingReservations = (reservations || [])
    .filter(r => isAfter(new Date(r.startDate), today) || 
                 (isAfter(new Date(r.endDate), today) && isBefore(new Date(r.startDate), today)))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3)
  
  const fioulRecords = (consumptionRecords || [])
    .filter(r => r.type === 'fioul')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  const electriciteRecords = (consumptionRecords || [])
    .filter(r => r.type === 'electricite')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const latestFioul = fioulRecords[0]
  const latestElectricite = electriciteRecords[0]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Bienvenue !</h2>
        <p className="text-muted-foreground mt-1">Bienvenue dans votre espace de gestion du chalet</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Réservations totales</CardTitle>
            <CalendarCheck className="text-muted-foreground" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(reservations || []).length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Toutes les réservations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dernier relevé fioul</CardTitle>
            <Flame className="text-muted-foreground" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestFioul ? `${latestFioul.quantity}L` : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {latestFioul ? format(new Date(latestFioul.date), 'dd MMM yyyy', { locale: fr }) : 'Aucun relevé'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dernier relevé électricité</CardTitle>
            <Lightning className="text-muted-foreground" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestElectricite ? `${latestElectricite.quantity} kWh` : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {latestElectricite ? format(new Date(latestElectricite.date), 'dd MMM yyyy', { locale: fr }) : 'Aucun relevé'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prochaines réservations</CardTitle>
          <CardDescription>Séjours à venir au chalet</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingReservations.length > 0 ? (
            <div className="flex flex-col gap-4">
              {upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{reservation.memberName}</p>
                      <Badge variant={reservation.status === 'confirmed' ? 'default' : 'secondary'}>
                        {reservation.status === 'confirmed' ? 'Confirmée' : 
                         reservation.status === 'pending' ? 'En attente' : 'Terminée'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(reservation.startDate), 'dd MMM', { locale: fr })} - {format(new Date(reservation.endDate), 'dd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{reservation.numberOfPeople} {reservation.numberOfPeople > 1 ? 'personnes' : 'personne'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Aucune réservation à venir</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
