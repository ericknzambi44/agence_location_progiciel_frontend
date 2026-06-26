/**
 * Composant d'affichage du détail du calcul d'une estimation de location.
 * Utilisé dans la création de contrat pour montrer la décomposition du prix.
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface EstimationDetailProps {
  prixUnitaire: number;
  duree: number;
  sousTotal: number;
  remises?: { label: string; montant: number }[];
  majorations?: { label: string; montant: number }[];
  forfait?: { label: string; montant: number };
  total: number;
  devise?: string;
  className?: string;
}

/**
 * Convertit une valeur en nombre, en gérant les chaînes et les undefined.
 */
const toNumber = (value: any): number => {
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return typeof value === 'number' && !isNaN(value) ? value : 0;
};

export const EstimationDetail = ({
  prixUnitaire,
  duree,
  sousTotal,
  remises = [],
  majorations = [],
  forfait,
  total,
  devise = '€',
  className,
}: EstimationDetailProps) => {
  // Conversion robuste de toutes les valeurs
  const safePrix = toNumber(prixUnitaire);
  const safeDuree = toNumber(duree);
  const safeSousTotal = toNumber(sousTotal);
  const safeTotal = toNumber(total);

  const safeRemises = remises.map(r => ({
    ...r,
    montant: toNumber(r.montant)
  }));
  const safeMajorations = majorations.map(m => ({
    ...m,
    montant: toNumber(m.montant)
  }));
  const safeForfait = forfait ? { ...forfait, montant: toNumber(forfait.montant) } : undefined;

  const hasDiscounts = safeRemises.length > 0 || safeMajorations.length > 0 || !!safeForfait;

  return (
    <Card className={cn('card-glass', className)}>
      <CardHeader>
        <CardTitle className="text-lg">Détail du calcul</CardTitle>
        <p className="text-sm text-muted-foreground">
          {safePrix.toFixed(2)} {devise} × {safeDuree} jour{safeDuree > 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Sous-total */}
        <div className="flex justify-between text-sm">
          <span>Prix de base</span>
          <span className="font-medium">{safeSousTotal.toFixed(2)} {devise}</span>
        </div>

        {/* Remises */}
        {safeRemises.map((r, idx) => (
          <div key={idx} className="flex justify-between text-sm text-green-600 dark:text-green-400">
            <span>{r.label}</span>
            <span>- {r.montant.toFixed(2)} {devise}</span>
          </div>
        ))}

        {/* Majorations */}
        {safeMajorations.map((m, idx) => (
          <div key={idx} className="flex justify-between text-sm text-orange-600 dark:text-orange-400">
            <span>{m.label}</span>
            <span>+ {m.montant.toFixed(2)} {devise}</span>
          </div>
        ))}

        {/* Forfait */}
        {safeForfait && (
          <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
            <span>{safeForfait.label}</span>
            <span>{safeForfait.montant.toFixed(2)} {devise}</span>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-base font-bold">
          <span>Total estimé</span>
          <span className="text-primary">{safeTotal.toFixed(2)} {devise}</span>
        </div>

        {!hasDiscounts && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            Aucune remise ou majoration appliquée.
          </p>
        )}
      </CardContent>
    </Card>
  );
};