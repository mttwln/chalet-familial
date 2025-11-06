import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Member } from '@/lib/types'
import { toast } from 'sonner'
import { Trash, Eye, EyeSlash } from '@phosphor-icons/react'
import { useState } from 'react'

export default function DataDebugView({ onClose }: { onClose: () => void }) {
  const [members, setMembers] = useKV<Member[]>('members', [])
  const [showPasswords, setShowPasswords] = useState(false)

  const handleClearAllData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer TOUTES les données? Cette action est irréversible!')) {
      setMembers([])
      toast.success('Toutes les données ont été supprimées')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  const handleDeleteMember = (memberId: string) => {
    setMembers((current) => (current || []).filter(m => m.id !== memberId))
    toast.success('Membre supprimé')
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Données de l'application</CardTitle>
            <CardDescription>
              Vue d'administration pour gérer les données stockées
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Membres enregistrés: {(members || []).length}</h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <EyeSlash size={16} /> : <Eye size={16} />}
                  {showPasswords ? 'Masquer' : 'Afficher'} mots de passe
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearAllData}
                >
                  <Trash size={16} />
                  Tout supprimer
                </Button>
              </div>
            </div>

            {members && members.length > 0 ? (
              <div className="flex flex-col gap-3">
                {members.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                            style={{ backgroundColor: member.avatarColor }}
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{member.name}</p>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                member.role === 'admin' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-secondary text-secondary-foreground'
                              }`}>
                                {member.role}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <p className="text-sm font-mono mt-1">
                              <span className="text-muted-foreground">Mot de passe: </span>
                              <span className="font-semibold">
                                {showPasswords ? member.password : '••••••••'}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">ID: {member.id}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Aucun membre enregistré
              </div>
            )}

            <Button onClick={onClose} variant="outline" className="mt-4">
              Retour à la connexion
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
