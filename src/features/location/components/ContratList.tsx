/**
 * Liste des contrats de location avec statuts et actions.
 * Affiche le montant total avec devise (par défaut €, à adapter selon le contexte).
 */
import { Link } from 'react-router-dom';
import { useContrats, useRetournerContrat } from '../hooks/useLocation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, Undo2, FileText } from 'lucide-react';

/**
 * Convertit une valeur en nombre de manière sécurisée.
 */
const toNumber = (value: any): number => {
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return typeof value === 'number' && !isNaN(value) ? value : 0;
};

const statutColors: Record<string, string> = {
  actif: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  termine: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  annule: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statutLabels: Record<string, string> = {
  actif: 'Actif',
  termine: 'Terminé',
  annule: 'Annulé',
};

export const ContratList = () => {
  const { data: contrats, isLoading, error, refetch } = useContrats();
  const { mutate: retourner, isPending } = useRetournerContrat();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement des contrats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-6 border border-destructive/20 rounded-lg bg-destructive/5">
        <p className="font-semibold">Erreur de chargement</p>
        <p className="text-sm">Impossible de récupérer la liste des contrats.</p>
      </div>
    );
  }

  const handleRetour = (id: string) => {
    if (window.confirm('Confirmer le retour du bien ?')) {
      retourner(id, { onSuccess: () => refetch() });
    }
  };

  const contratsList = contrats || [];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Contrats de location
          </h1>
          <p className="text-sm text-muted-foreground">
            {contratsList.length} contrat{contratsList.length > 1 ? 's' : ''} actif{contratsList.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link to="nouveau">
          <Button className="btn-elite w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Nouveau contrat
          </Button>
        </Link>
      </div>

      {/* Liste */}
      {contratsList.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg border-muted-foreground/20">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">Aucun contrat enregistré.</p>
          <p className="text-sm text-muted-foreground">Cliquez sur "Nouveau contrat" pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {contratsList.map((contrat) => {
            const statutColor = statutColors[contrat.statut] || 'bg-gray-100 text-gray-800';
            const statutLabel = statutLabels[contrat.statut] || contrat.statut;
            const montant = toNumber(contrat.montant_total);

            return (
              <Card key={contrat.id} className="card-glass hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <CardTitle className="text-lg">
                      Contrat {contrat.id.slice(0, 8)}
                    </CardTitle>
                    <Badge className={`capitalize ${statutColor}`}>
                      {statutLabel}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {contrat.statut === 'actif' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetour(contrat.id)}
                        disabled={isPending}
                        className="gap-1"
                      >
                        <Undo2 className="h-4 w-4" /> Retourner
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`${contrat.id}`}>Détail</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Client</span>
                    <p className="font-medium truncate" title={contrat.client_id}>
                      {contrat.client_id.slice(0, 8)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Bien</span>
                    <p className="font-medium truncate" title={contrat.bien_id}>
                      {contrat.bien_id.slice(0, 8)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Période</span>
                    <p className="font-medium">
                      {contrat.date_debut} → {contrat.date_fin}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Montant total</span>
                    <p className="font-bold text-primary">
                      {montant.toFixed(2)} €
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};