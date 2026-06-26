import { Link } from 'react-router-dom';
import { Bien } from '../types/bien.types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BienCardProps {
  bien: Bien;
}

/**
 * Carte présentant un bien avec son état coloré et sa devise.
 * Utilisée dans la liste des biens.
 */
export const BienCard = ({ bien }: BienCardProps) => {
  const etatBadgeVariant: Record<Bien['etat'], string> = {
    disponible: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    en_maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    endommage: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    archive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  };

  // Conversion robuste du prix en nombre
  const prix = typeof bien.prix_unitaire_ht === 'string'
    ? parseFloat(bien.prix_unitaire_ht)
    : bien.prix_unitaire_ht;

  // Devise par défaut si non définie
  const devise = bien.devise || 'USD';

  return (
    <Link to={`/stock/${bien.id}`} className="block h-full">
      <Card className="h-full hover:shadow-lg transition-shadow card-glass">
        <CardHeader>
          <CardTitle className="flex justify-between items-start gap-2">
            <span className="truncate text-lg">{bien.nom}</span>
            <Badge className={cn('capitalize shrink-0', etatBadgeVariant[bien.etat])}>
              {bien.etat.replace('_', ' ')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm text-muted-foreground">Réf: {bien.reference}</p>
          <p className="font-semibold">
            {isNaN(prix) ? '—' : `${prix.toFixed(2)} ${devise}`}
          </p>
          {bien.date_achat && (
            <p className="text-xs text-muted-foreground">Acheté le {bien.date_achat}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};