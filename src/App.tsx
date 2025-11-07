import { useState, useEffect } from 'react'
import { useStorage } from '@/hooks/useStorage'
import { House, Calendar, CurrencyCircleDollar, Flame, Users, List, SignOut } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Member } from '@/lib/types'
import Dashboard from '@/components/Dashboard'
import CalendarView from '@/components/CalendarView'
import FinancesView from '@/components/FinancesView'
import ConsumptionView from '@/components/ConsumptionView'
import MembersView from '@/components/MembersView'
import AuthView from '@/components/AuthView'
import { toast } from 'sonner'

type View = 'dashboard' | 'calendar' | 'finances' | 'consumption' | 'members'

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [currentMember, setCurrentMember] = useStorage<Member | null>('current-member', null)
  const [members] = useStorage<Member[]>('members', [])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (currentMember && members && members.length > 0) {
      const updatedMember = members.find(m => m.id === currentMember.id)
      if (updatedMember && (
        updatedMember.name !== currentMember.name ||
        updatedMember.email !== currentMember.email ||
        updatedMember.role !== currentMember.role
      )) {
        setCurrentMember(updatedMember)
      }
    }
  }, [members, currentMember, setCurrentMember])

  const handleLogout = () => {
    setCurrentMember(null)
    toast.success('Déconnexion réussie')
  }

  const navItems = [
    { id: 'dashboard' as View, label: 'Accueil', icon: House },
    { id: 'calendar' as View, label: 'Calendrier', icon: Calendar },
    { id: 'finances' as View, label: 'Finances', icon: CurrencyCircleDollar },
    { id: 'consumption' as View, label: 'Consommation', icon: Flame },
    ...(currentMember?.role === 'admin' ? [{ id: 'members' as View, label: 'Membres', icon: Users }] : []),
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
      case 'members':
        return <MembersView />
      default:
        return <Dashboard />
    }
  }

  const handleNavClick = (view: View) => {
    setCurrentView(view)
    setMobileMenuOpen(false)
  }

  if (!currentMember) {
    return <AuthView />
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
                <div className="border-t border-border mt-4 pt-4">
                  <div className="flex items-center gap-2 px-3 py-2 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: currentMember.avatarColor }}>
                      {currentMember.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground">{currentMember.name}</span>
                  </div>
                  <Button variant="ghost" onClick={handleLogout} className="gap-2 justify-start w-full">
                    <SignOut size={18} />
                    Déconnexion
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: currentMember.avatarColor }}>
              {currentMember.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-foreground">{currentMember.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Déconnexion">
              <SignOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        {renderView()}
      </main>
    </div>
  )
}

export default App
