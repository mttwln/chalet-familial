import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { House, Eye, EyeSlash, Gear } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Member } from '@/lib/types'
import { toast } from 'sonner'
import DataDebugView from '@/components/DataDebugView'

const AVATAR_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', 
  '#EF4444', '#06B6D4', '#6366F1', '#84CC16', '#F97316'
]

const DEFAULT_ADMIN_EMAIL = 'matthieu.weinlein@gmx.net'
const DEFAULT_ADMIN_PASSWORD = 'Admin2024!'
const DEFAULT_ADMIN_NAME = 'Matthieu Weinlein'

export default function AuthView() {
  const [members, setMembers] = useKV<Member[]>('members', [])
  const [, setCurrentMember] = useKV<Member | null>('current-member', null)
  const [showPassword, setShowPassword] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  })

  useEffect(() => {
    if (!members || members.length === 0) {
      const adminMember: Member = {
        id: Date.now().toString(),
        name: DEFAULT_ADMIN_NAME,
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD,
        role: 'admin',
        avatarColor: '#3B82F6'
      }
      setMembers([adminMember])
      toast.success('Compte administrateur initialisé', {
        description: `Email: ${DEFAULT_ADMIN_EMAIL}`
      })
    }
  }, [])

  if (showDebug) {
    return <DataDebugView onClose={() => setShowDebug(false)} />
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginData.email.trim() || !loginData.password.trim()) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    const member = (members || []).find(m => m.email === loginData.email)
    
    if (!member) {
      toast.error('Email non trouvé')
      return
    }

    if (member.password !== loginData.password) {
      toast.error('Mot de passe incorrect')
      return
    }

    setCurrentMember(member)
    toast.success(`Bienvenue ${member.name}!`)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (!registerData.name.trim() || !registerData.email.trim() || 
        !registerData.password.trim() || !registerData.confirmPassword.trim()) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (registerData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    const emailExists = (members || []).some(m => m.email === registerData.email)
    if (emailExists) {
      toast.error('Cet email est déjà utilisé')
      return
    }

    const isFirstUser = !members || members.length === 0

    const newMember: Member = {
      id: Date.now().toString(),
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      role: isFirstUser ? 'admin' : 'user',
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
    }

    setMembers(current => [...(current || []), newMember])
    setCurrentMember(newMember)
    toast.success(isFirstUser ? 'Compte administrateur créé!' : 'Inscription réussie!')
  }

  const isFirstUser = !members || members.length === 0

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDebug(true)}
          title="Voir les données stockées"
        >
          <Gear size={20} />
        </Button>
      </div>
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <House weight="fill" className="text-primary-foreground" size={32} />
          </div>
          <CardTitle className="text-2xl">Chalet Familial</CardTitle>
          <CardDescription>
            {isFirstUser 
              ? 'Créez le premier compte administrateur' 
              : 'Gestion & Réservations'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFirstUser ? (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-name">Nom complet</Label>
                <Input
                  id="reg-name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="jean@exemple.fr"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Au moins 6 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-confirm">Confirmer le mot de passe</Label>
                <Input
                  id="reg-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Répétez le mot de passe"
                />
              </div>
              <Button type="submit" className="w-full mt-2">
                Créer mon compte administrateur
              </Button>
            </form>
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-4">
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="jean@exemple.fr"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Votre mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-2">
                    Se connecter
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="mt-4">
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reg-name">Nom complet</Label>
                    <Input
                      id="reg-name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="jean@exemple.fr"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reg-password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Au moins 6 caractères"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reg-confirm">Confirmer le mot de passe</Label>
                    <Input
                      id="reg-confirm"
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Répétez le mot de passe"
                    />
                  </div>
                  <Button type="submit" className="w-full mt-2">
                    S'inscrire
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
