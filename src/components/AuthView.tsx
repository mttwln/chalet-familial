import { useState } from 'react'
import { useStorage } from '@/hooks/useStorage'
import { House, Eye, EyeSlash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Member } from '@/lib/types'
import { toast } from 'sonner'

const AVATAR_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', 
  '#EF4444', '#06B6D4', '#6366F1', '#84CC16', '#F97316'
]

export default function AuthView() {
  const [members, setMembers] = useStorage<Member[]>('members', [])
  const [, setCurrentMember] = useStorage<Member | null>('current-member', null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginData.email.trim() || !loginData.password.trim()) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    setIsLoading(true)

    // Simple localStorage-based login
    const member = members.find(m => m.email.toLowerCase() === loginData.email.toLowerCase())
    
    if (!member) {
      toast.error('Email non trouvé')
      setIsLoading(false)
      return
    }

    if (member.password !== loginData.password) {
      toast.error('Mot de passe incorrect')
      setIsLoading(false)
      return
    }

    setCurrentMember(member)
    toast.success(`Bienvenue ${member.name}!`)
    setIsLoading(false)
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

    setIsLoading(true)

    // Check if email already exists
    const emailExists = members.some(m => m.email.toLowerCase() === registerData.email.toLowerCase())
    if (emailExists) {
      toast.error('Cet email est déjà utilisé')
      setIsLoading(false)
      return
    }

    const isFirstUser = members.length === 0

    const newMember: Member = {
      id: Date.now().toString(),
      name: registerData.name,
      email: registerData.email.toLowerCase(),
      password: registerData.password,
      role: isFirstUser ? 'admin' : 'user',
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
    }

    const updatedMembers = [...members, newMember]
    setMembers(updatedMembers)
    setCurrentMember(newMember)
    toast.success(isFirstUser ? 'Compte administrateur créé!' : 'Inscription réussie!')
    setIsLoading(false)
  }

  const isFirstUser = members.length === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <House weight="fill" className="text-white" size={40} />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Chalet Familial</CardTitle>
            <CardDescription className="text-base mt-2">
              {isFirstUser 
                ? 'Créez le premier compte administrateur' 
                : 'Connectez-vous ou créez un compte'}
            </CardDescription>
          </div>
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
                  autoComplete="name"
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
                  autoComplete="email"
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
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" disabled={isLoading}>
                {isLoading ? 'Création en cours...' : 'Créer mon compte administrateur'}
              </Button>
            </form>
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>
            
              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="jean@exemple.fr"
                      autoComplete="email"
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
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" disabled={isLoading}>
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </form>
              </TabsContent>
            
              <TabsContent value="register" className="mt-0">
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reg-name">Nom complet</Label>
                    <Input
                      id="reg-name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Jean Dupont"
                      autoComplete="name"
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
                      autoComplete="email"
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
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                      autoComplete="new-password"
                    />
                  </div>
                  <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" disabled={isLoading}>
                    {isLoading ? 'Inscription...' : 'S\'inscrire'}
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
