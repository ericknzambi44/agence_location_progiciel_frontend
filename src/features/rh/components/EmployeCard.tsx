import { Link } from 'react-router-dom';
import { Employe } from '../types/employe.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EmployeCardProps {
  employe: Employe;
}

export const EmployeCard = ({ employe }: EmployeCardProps) => {
  return (
    <Link to={`/rh/${employe.id}`} className="block h-full">
      <Card className="h-full hover:shadow-lg transition-shadow card-glass">
        <CardHeader>
          <CardTitle className="text-lg flex justify-between">
            <span>{employe.prenom} {employe.nom}</span>
            <Badge variant={employe.est_actif ? 'default' : 'secondary'}>
              {employe.est_actif ? 'Actif' : 'Inactif'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>Matricule: {employe.matricule}</p>
          <p>Poste: {employe.poste}</p>
          <p>Taux horaire: {employe.taux_horaire} €</p>
        </CardContent>
      </Card>
    </Link>
  );
};