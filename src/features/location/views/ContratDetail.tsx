/**
 * Détail d'un contrat de location.
 * Affiche les informations du contrat, le montant avec devise,
 * et permet de retourner le bien si le contrat est actif.
 */
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Undo2, Calendar, User, Package, DollarSign, FileText } from 'lucide-react';
import { useContrats, useRetournerContrat } from '../hooks/useLocation';
import { useClients } from '../hooks/useLocation';
import { useBiens } from '@/features/stock/hooks/useBiens';
import { locationService } from '../services/location.services';
import { Contrat } from '../types/location.types';
import { Client } from '../types/location.types';
import { Bien } from '@/features/stock/types/bien.types';

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

// Statut des couleurs
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

/**
 * Hook pour récupérer un contrat par son ID.
 */
const useContrat = (id: string) => {
  return useQuery<Contrat>({
    queryKey: ['location', 'contrats', id],
    queryFn: () => locationService.getContrat(id).then(res => res.data),
    enabled: !!id,
  });
};

export const ContratDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Données du contrat
  const { data: contrat, isLoading, error } = useContrat(id!);
  const { data: clients } = useClients();
  const { data: biens } = useBiens();

  // Mutation pour le retour
  const { mutate: retourner, isPending: isRetourPending } = useRetournerContrat();
  const [actionError, setActionError] = useState<string | null>(null);

  // Chargement
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement du contrat...</p>
      </div>
    );
  }

  // Erreur
  if (error || !contrat) {
    return (
      <div className="text-destructive text-center p-6 border border-destructive/20 rounded-lg bg-destructive/5 max-w-3xl mx-auto mt-10">
        <p className="font-semibold">Erreur</p>
        <p className="text-sm">Impossible de charger les détails du contrat.</p>
        <Button variant="outline" onClick={() => navigate('/location/contrats')} className="mt-4">
          Retour à la liste
        </Button>
      </div>
    );
  }

  // Trouver le client et le bien associés
  const client = clients?.find((c: Client) => c.id === contrat.client_id);
  const bien = biens?.find((b: Bien) => b.id === contrat.bien_id);

  // Devise : par défaut EUR, on peut l'extraire du bien si disponible
  const devise = bien?.devise || 'EUR';

  // Montant converti en nombre
  const montant = toNumber(contrat.montant_total);

  const statutColor = statutColors[contrat.statut] || 'bg-gray-100 text-gray-800';
  const statutLabel = statutLabels[contrat.statut] || contrat.statut;

  // Action : retourner le bien
  const handleRetour = () => {
    if (!window.confirm('Confirmer le retour du bien ?')) return;
    setActionError(null);
    retourner(contrat.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['location', 'contrats'] });
        queryClient.invalidateQueries({ queryKey: ['location', 'contrats', id] });
      },
      onError: (err: any) => {
        setActionError(err.response?.data?.error || 'Erreur lors du retour.');
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in space-y-6">
      {/* Bouton retour */}
      <Button variant="ghost" onClick={() => navigate('/location/contrats')} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Retour à la liste
      </Button>

      {/* En-tête du contrat */}
      <Card className="card-glass border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Contrat {contrat.id.slice(0, 8)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Créé le {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge className={`capitalize text-base px-4 py-1 ${statutColor}`}>
              {statutLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Client</span>
              </div>
              <p className="font-medium">
                {client ? `${client.prenom} ${client.nom}` : contrat.client_id.slice(0, 8)}
              </p>
              {client && (
                <p className="text-xs text-muted-foreground">{client.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Bien</span>
              </div>
              <p className="font-medium">
                {bien ? bien.nom : contrat.bien_id.slice(0, 8)}
              </p>
              {bien && (
                <p className="text-xs text-muted-foreground">Réf: {bien.reference}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Date de début</span>
              </div>
              <p className="font-medium">{contrat.date_debut}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Date de fin</span>
              </div>
              <p className="font-medium">{contrat.date_fin}</p>
            </div>
          </div>

          {/* Montant total */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <DollarSign className="h-4 w-4" />
              <span>Montant total</span>
            </div>
            <p className="text-3xl font-bold text-primary">
              {montant.toFixed(2)} {devise}
            </p>
          </div>

          {/* Action : Retourner (si actif) */}
          {contrat.statut === 'actif' && (
            <div className="pt-4 border-t">
              <Button
                onClick={handleRetour}
                disabled={isRetourPending}
                variant="destructive"
                className="gap-2"
              >
                {isRetourPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Retour en cours...</>
                ) : (
                  <><Undo2 className="h-4 w-4" /> Retourner le bien</>
                )}
              </Button>
              {actionError && (
                <p className="text-destructive text-sm mt-2">{actionError}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};