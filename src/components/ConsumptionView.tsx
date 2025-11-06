import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Plus, Flame, Lightning, TrendUp } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ConsumptionRecord, Member } from '@/lib/types'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function ConsumptionView() {
  const [currentMember] = useKV<Member | null>('current-member', null)
  const [consumptionRecords, setConsumptionRecords] = useKV<ConsumptionRecord[]>('consumption-records', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: 'fioul' as 'fioul' | 'electricite',
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    cost: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.quantity || !formData.cost) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    const newRecord: ConsumptionRecord = {
      id: Date.now().toString(),
      type: formData.type,
      date: formData.date,
      quantity: parseFloat(formData.quantity),
      cost: parseFloat(formData.cost),
      addedBy: currentMember?.name || 'Inconnu'
    }

    setConsumptionRecords(current => [...(current || []), newRecord])
    toast.success('Relevé ajouté avec succès')
    setIsDialogOpen(false)
    setFormData({
      type: 'fioul',
      date: new Date().toISOString().split('T')[0],
      quantity: '',
      cost: ''
    })
  }

  const fioulRecords = (consumptionRecords || [])
    .filter(r => r.type === 'fioul')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const electriciteRecords = (consumptionRecords || [])
    .filter(r => r.type === 'electricite')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const fioulChartData = fioulRecords.map(r => ({
    date: format(new Date(r.date), 'dd MMM', { locale: fr }),
    quantity: r.quantity,
    cost: r.cost
  }))

  const electriciteChartData = electriciteRecords.map(r => ({
    date: format(new Date(r.date), 'dd MMM', { locale: fr }),
    quantity: r.quantity,
    cost: r.cost
  }))

  const totalFioulCost = fioulRecords.reduce((sum, r) => sum + r.cost, 0)
  const totalElectriciteCost = electriciteRecords.reduce((sum, r) => sum + r.cost, 0)
  const totalFioulQuantity = fioulRecords.reduce((sum, r) => sum + r.quantity, 0)
  const totalElectriciteQuantity = electriciteRecords.reduce((sum, r) => sum + r.quantity, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Suivi de consommation</h2>
          <p className="text-sm text-muted-foreground">Relevés de fioul et électricité</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Ajouter un relevé
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau relevé</DialogTitle>
              <DialogDescription>Enregistrez une nouvelle consommation</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: 'fioul' | 'electricite') => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fioul">Fioul</SelectItem>
                      <SelectItem value="electricite">Électricité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="quantity">
                    Quantité {formData.type === 'fioul' ? '(litres)' : '(kWh)'}
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="0"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cost">Coût (€)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fioul total</CardTitle>
            <Flame className="text-orange-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFioulQuantity.toFixed(0)} L</div>
            <p className="text-xs text-muted-foreground mt-1">
              {fioulRecords.length} relevés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Coût fioul</CardTitle>
            <TrendUp className="text-muted-foreground" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFioulCost.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground mt-1">
              {fioulRecords.length > 0 ? `${(totalFioulCost / totalFioulQuantity).toFixed(2)} €/L` : '-'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Électricité totale</CardTitle>
            <Lightning className="text-yellow-500" size={20} weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalElectriciteQuantity.toFixed(0)} kWh</div>
            <p className="text-xs text-muted-foreground mt-1">
              {electriciteRecords.length} relevés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Coût électricité</CardTitle>
            <TrendUp className="text-muted-foreground" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalElectriciteCost.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground mt-1">
              {electriciteRecords.length > 0 ? `${(totalElectriciteCost / totalElectriciteQuantity).toFixed(3)} €/kWh` : '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fioul" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="fioul" className="gap-2">
            <Flame size={16} />
            Fioul
          </TabsTrigger>
          <TabsTrigger value="electricite" className="gap-2">
            <Lightning size={16} />
            Électricité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fioul" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution de la consommation de fioul</CardTitle>
              <CardDescription>Historique des relevés et coûts</CardDescription>
            </CardHeader>
            <CardContent>
              {fioulRecords.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fioulChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.005 240)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="oklch(0.45 0.02 240)"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="oklch(0.45 0.02 240)"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'oklch(0.99 0 0)',
                          border: '1px solid oklch(0.88 0.005 240)',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="quantity" 
                        stroke="oklch(0.65 0.15 240)" 
                        strokeWidth={2}
                        name="Quantité (L)"
                        dot={{ fill: 'oklch(0.65 0.15 240)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cost" 
                        stroke="oklch(0.75 0.04 60)" 
                        strokeWidth={2}
                        name="Coût (€)"
                        dot={{ fill: 'oklch(0.75 0.04 60)' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Flame size={48} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Aucun relevé de fioul</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="electricite" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution de la consommation d'électricité</CardTitle>
              <CardDescription>Historique des relevés et coûts</CardDescription>
            </CardHeader>
            <CardContent>
              {electriciteRecords.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={electriciteChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.005 240)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="oklch(0.45 0.02 240)"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="oklch(0.45 0.02 240)"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'oklch(0.99 0 0)',
                          border: '1px solid oklch(0.88 0.005 240)',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="quantity" 
                        stroke="oklch(0.65 0.15 240)" 
                        strokeWidth={2}
                        name="Quantité (kWh)"
                        dot={{ fill: 'oklch(0.65 0.15 240)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cost" 
                        stroke="oklch(0.75 0.04 60)" 
                        strokeWidth={2}
                        name="Coût (€)"
                        dot={{ fill: 'oklch(0.75 0.04 60)' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Lightning size={48} className="mx-auto text-muted-foreground mb-3" weight="fill" />
                  <p className="text-sm text-muted-foreground">Aucun relevé d'électricité</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
