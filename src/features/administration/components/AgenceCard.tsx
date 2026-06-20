import { Agence } from '../types/admin.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AgenceCardProps {
  agence: Agence;
}

export const AgenceCard = ({ agence }: AgenceCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow card-glass">
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle className="text-lg">{agence.nom}</CardTitle>
        <Badge variant={agence.actif ? 'default' : 'secondary'}>
          {agence.actif ? 'Active' : 'Inactive'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p>{agence.adresse_ligne1}</p>
        {agence.adresse_ligne2 && <p>{agence.adresse_ligne2}</p>}
        <p>{agence.code_postal} {agence.ville}, {agence.pays}</p>
        <p>Tél: {agence.telephone}</p>
        <p>Email: {agence.email}</p>
        <p className="text-xs text-muted-foreground">Créée le {new Date(agence.date_creation).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
};