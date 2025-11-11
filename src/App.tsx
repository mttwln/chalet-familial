import { useState } from 'react'
import { House, Calendar, CurrencyCircleDollar, Flame, List } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Dashboard from '@/components/Dashboard'
import CalendarView from '@/components/CalendarView'
import FinancesView from '@/components/FinancesView'
import ConsumptionView from '@/components/ConsumptionView'

type View = 'dashboard' | 'calendar' | 'finances' | 'consumption'

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard' as View, label: 'Accueil', icon: House },
    { id: 'calendar' as View, label: 'Calendrier', icon: Calendar },
    { id: 'finances' as View, label: 'Finances', icon: CurrencyCircleDollar },
    { id: 'consumption' as View, label: 'Consommation', icon: Flame },
  ]

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'calendar':
        return <CalendarView />
      case 'finances':
        return <FinancesView />
      case 'consumption':
        return <ConsumptionView />
      default:
        return <Dashboard />
    }
  }

  const handleNavClick = (view: View) => {
    setCurrentView(view)
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <House weight="fill" className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Chalet Familial</h1>
              <p className="text-xs text-muted-foreground">Gestion & Réservations</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'secondary' : 'ghost'}
                  onClick={() => setCurrentView(item.id)}
                  className="gap-2"
                >
                  <Icon size={18} />
                  {item.label}
                </Button>
              )
            })}
          </nav>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <List size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentView === item.id
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? 'secondary' : 'ghost'}
                      onClick={() => handleNavClick(item.id)}
                      className="gap-2 justify-start"
                    >
                      <Icon size={18} />
                      {item.label}
                    </Button>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        {renderView()}
      </main>
    </div>
  )
}

export default App
