import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEmployesActifs, usePointages, useEnregistrerPointage } from '../hooks/useRH';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

export const EmployeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { data: employes } = useEmployesActifs();
  const employe = employes?.find(e => e.id === id);
  const { data: pointages, refetch } = usePointages(id!, selectedDate);
  const { mutate: enregistrer, isPending } = useEnregistrerPointage();

  if (!employe) return <div>Employé non trouvé</div>;

  const handlePointage = (type: 'ENTRY' | 'EXIT') => {
    enregistrer(
      {
        employe_id: employe.id,
        type,
        horodatage: new Date().toISOString(),
        commentaire: '',
      },
      { onSuccess: () => refetch() }
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap justify-between items-start gap-2">
            <span>{employe.prenom} {employe.nom}</span>
            <Badge variant={employe.est_actif ? 'default' : 'secondary'}>
              {employe.est_actif ? 'Actif' : 'Inactif'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><strong>Matricule:</strong> {employe.matricule}</div>
          <div><strong>Poste:</strong> {employe.poste}</div>
          <div><strong>Email:</strong> {employe.email}</div>
          <div><strong>Taux horaire:</strong> {employe.taux_horaire} €</div>
          <div><strong>Date d'embauche:</strong> {employe.date_embauche}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pointage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handlePointage('ENTRY')} disabled={isPending} className="btn-elite">
              Entrée
            </Button>
            <Button onClick={() => handlePointage('EXIT')} disabled={isPending} variant="outline">
              Sortie
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Label>Consulter les pointages par date</Label>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="sm:w-48"
              />
              <Button variant="outline" onClick={() => refetch()}>Rafraîchir</Button>
            </div>
            {pointages && pointages.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {pointages.map((p) => (
                  <li key={p.id} className="flex justify-between items-center border-b py-2">
                    <span>{new Date(p.horodatage).toLocaleTimeString()}</span>
                    <Badge variant={p.type === 'ENTRY' ? 'default' : 'secondary'}>
                      {p.type}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground mt-4">Aucun pointage ce jour.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};