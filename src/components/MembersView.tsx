import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Plus, Trash, UserCircle, UsersThree } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Member } from '@/lib/types'
import { toast } from 'sonner'

const AVATAR_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', 
  '#EF4444', '#06B6D4', '#6366F1', '#84CC16', '#F97316'
]

interface MembersViewProps {
  isFirstTime?: boolean
}

export default function MembersView({ isFirstTime = false }: MembersViewProps) {
  const [members, setMembers] = useKV<Member[]>('members', [])
  const [currentMember, setCurrentMember] = useKV<Member | null>('current-member', null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user' as 'admin' | 'user' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    if (editingMember) {
      setMembers(current => 
        (current || []).map(m => m.id === editingMember.id ? { ...m, ...formData } : m)
      )
      toast.success('Membre mis à jour')
    } else {
      const newMember: Member = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: isFirstTime && (members || []).length === 0 ? 'admin' : formData.role,
        avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
      }
      setMembers(current => [...(current || []), newMember])
      
      if (isFirstTime) {
        setCurrentMember(newMember)
      }
      
      toast.success(isFirstTime ? 'Profil créé avec succès' : 'Membre ajouté')
    }

    setIsDialogOpen(false)
    setEditingMember(null)
    setFormData({ name: '', email: '', role: 'user' })
  }

  const handleEdit = (member: Member) => {
    setEditingMember(member)
    setFormData({ name: member.name, email: member.email, role: member.role })
    setIsDialogOpen(true)
  }

  const handleDelete = (memberId: string) => {
    if (currentMember?.id === memberId) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte')
      return
    }
    setMembers(current => (current || []).filter(m => m.id !== memberId))
    toast.success('Membre supprimé')
  }

  const handleSelectMember = (member: Member) => {
    setCurrentMember(member)
    toast.success(`Connecté en tant que ${member.name}`)
  }

  if (isFirstTime) {
    if ((members || []).length === 0) {
      return (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Bienvenue au Chalet Familial</CardTitle>
            <CardDescription>Créez le premier compte administrateur</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="jean@exemple.fr"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Rôle</Label>
                <Select value="admin" onValueChange={(value: 'admin' | 'user') => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Créer mon profil administrateur</Button>
            </form>
          </CardContent>
        </Card>
      )
    } else {
      return (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>Sélectionnez votre profil pour continuer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {(members || []).map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-accent/10 transition-colors"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
                    style={{ backgroundColor: member.avatarColor }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                      member.role === 'admin' 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {member.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des membres</h2>
          <p className="text-sm text-muted-foreground">Gérez les membres de la famille</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingMember(null)
            setFormData({ name: '', email: '', role: 'user' })
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Ajouter un membre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Modifier le membre' : 'Ajouter un membre'}</DialogTitle>
              <DialogDescription>
                {editingMember ? 'Modifiez les informations du membre' : 'Ajoutez un nouveau membre de la famille'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-name">Nom complet</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Jean Dupont"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="jean@exemple.fr"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-role">Rôle</Label>
                  <Select value={formData.role} onValueChange={(value: 'admin' | 'user') => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger id="edit-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="user">Utilisateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingMember ? 'Mettre à jour' : 'Ajouter'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(members || []).map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.role === 'admin' 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {member.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {currentMember?.role === 'admin' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                          Modifier
                        </Button>
                        {currentMember.id !== member.id && (
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(member.id)}>
                            <Trash size={16} />
                          </Button>
                        )}
                      </>
                    )}
                    {currentMember?.id !== member.id && (
                      <Button size="sm" variant="secondary" onClick={() => handleSelectMember(member)} className="gap-1">
                        <UserCircle size={16} />
                        Se connecter
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!members || members.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <UsersThree size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Aucun membre</h3>
            <p className="text-sm text-muted-foreground">Commencez par ajouter un membre de la famille</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
