import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatutBadgeProps {
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
}

const variantMap: Record<StatutBadgeProps['statut'], string> = {
  planifiee: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  en_cours: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  terminee: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  annulee: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

export const StatutBadge = ({ statut }: StatutBadgeProps) => {
  return (
    <Badge className={cn('capitalize', variantMap[statut])}>
      {statut.replace('_', ' ')}
    </Badge>
  );
};