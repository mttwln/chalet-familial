import { useStorage } from '@/hooks/useStorage'
import { CurrencyCircleDollar, Calendar } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Member, Reservation, FinancialContribution } from '@/lib/types'
import { useMemo } from 'react'

const DAILY_RATE = 25
const PERSON_RATE = 10

export default function FinancesView() {
  const [members] = useStorage<Member[]>('members', [])
  const [reservations] = useStorage<Reservation[]>('reservations', [])

  const contributions = useMemo(() => {
    const memberContributions: { [key: string]: FinancialContribution } = {}

    ;(members || []).forEach(member => {
      memberContributions[member.id] = {
        memberId: member.id,
        memberName: member.name,
        totalDays: 0,
        totalPeople: 0,
        contribution: 0
      }
    })

    ;(reservations || []).forEach(reservation => {
      const start = new Date(reservation.startDate)
      const end = new Date(reservation.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

      if (memberContributions[reservation.memberId]) {
        memberContributions[reservation.memberId].totalDays += days
        memberContributions[reservation.memberId].totalPeople += reservation.numberOfPeople
        memberContributions[reservation.memberId].contribution += 
          (days * DAILY_RATE) + (reservation.numberOfPeople * PERSON_RATE * days)
      }
    })

    return Object.values(memberContributions).filter(c => c.totalDays > 0)
  }, [members, reservations])

  const totalContributions = contributions.reduce((sum, c) => sum + c.contribution, 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Participation aux frais</h2>
        <p className="text-sm text-muted-foreground">Calcul automatique basé sur les réservations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total des contributions</CardTitle>
            <CurrencyCircleDollar className="text-muted-foreground" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContributions.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pour toutes les réservations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tarif journalier</CardTitle>
            <Calendar className="text-muted-foreground" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DAILY_RATE} €</div>
            <p className="text-xs text-muted-foreground mt-1">
              Par jour de séjour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tarif par personne</CardTitle>
            <CurrencyCircleDollar className="text-muted-foreground" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{PERSON_RATE} €</div>
            <p className="text-xs text-muted-foreground mt-1">
              Par personne et par jour
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tableau récapitulatif</CardTitle>
          <CardDescription>Détail des contributions par membre de la famille</CardDescription>
        </CardHeader>
        <CardContent>
          {contributions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membre</TableHead>
                    <TableHead className="text-right">Jours totaux</TableHead>
                    <TableHead className="text-right">Personnes totales</TableHead>
                    <TableHead className="text-right">Contribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contributions.map((contribution) => {
                    const member = (members || []).find(m => m.id === contribution.memberId)
                    return (
                      <TableRow key={contribution.memberId}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {member && (
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                                style={{ backgroundColor: member.avatarColor }}
                              >
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            {contribution.memberName}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{contribution.totalDays}</TableCell>
                        <TableCell className="text-right">{contribution.totalPeople}</TableCell>
                        <TableCell className="text-right font-semibold">{contribution.contribution.toFixed(2)} €</TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={3} className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold">{totalContributions.toFixed(2)} €</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CurrencyCircleDollar size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Aucune contribution calculée</p>
              <p className="text-xs text-muted-foreground mt-1">Les contributions apparaîtront après les réservations</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mode de calcul</CardTitle>
          <CardDescription>Comment sont calculées les contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 text-sm">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-foreground mb-1">Tarif de base</p>
              <p className="text-muted-foreground">
                {DAILY_RATE} € par jour de séjour, quel que soit le nombre de personnes
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-foreground mb-1">Tarif par personne</p>
              <p className="text-muted-foreground">
                {PERSON_RATE} € par personne et par jour (appliqué à chaque occupant)
              </p>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="font-medium text-foreground mb-1">Formule complète</p>
              <p className="text-muted-foreground">
                Contribution = (Nombre de jours × {DAILY_RATE} €) + (Nombre de jours × Nombre de personnes × {PERSON_RATE} €)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
