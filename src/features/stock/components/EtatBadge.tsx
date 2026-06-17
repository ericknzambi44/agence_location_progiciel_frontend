import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Bien } from '../types/bien.types';

interface EtatBadgeProps {
  etat: Bien['etat'];
  className?: string;
}

const variantMap: Record<Bien['etat'], string> = {
  disponible: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  en_maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  endommage: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  archive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

export const EtatBadge = ({ etat, className }: EtatBadgeProps) => {
  return (
    <Badge className={cn('capitalize', variantMap[etat], className)}>
      {etat.replace('_', ' ')}
    </Badge>
  );
};