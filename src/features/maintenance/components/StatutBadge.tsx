import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatutBadgeProps {
  statut?: 'planifiee' | 'en_cours' | 'terminee' | 'annulee' | string; // accepte aussi une chaîne générique
}

// Mappage des couleurs par statut
const variantMap: Record<string, string> = {
  planifiee: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  en_cours: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  terminee: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  annulee: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

/**
 * Affiche un badge coloré pour le statut d'une intervention.
 * Gère le cas où `statut` est undefined ou null.
 */
export const StatutBadge = ({ statut }: StatutBadgeProps) => {
  // Fallback si statut est manquant
  const statutStr = statut || 'inconnu';
  const displayLabel = statutStr.replace('_', ' ');
  const variantClass = variantMap[statutStr] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

  return (
    <Badge className={cn('capitalize', variantClass)}>
      {displayLabel}
    </Badge>
  );
};