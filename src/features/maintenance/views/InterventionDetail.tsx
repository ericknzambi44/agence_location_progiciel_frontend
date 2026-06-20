import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  useIntervention,
  useDemarrerIntervention,
  useAjouterPiece,
  useTerminerIntervention,
  useCalculerCout,
  usePieces,
  useTechniciens,
  useRetirerPiece,
} from '../hooks/useMaintenance';
import { useBiens } from '@/features/stock/hooks/useBiens';
import { StatutBadge } from '../components/StatutBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2 } from 'lucide-react';

export const InterventionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedPiece, setSelectedPiece] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    data: intervention,
    isLoading: isLoadingIntervention,
    isError: isErrorIntervention,
    refetch,
  } = useIntervention(id!);

  const { data: biens, isLoading: isLoadingBiens } = useBiens();
  const { data: techniciens, isLoading: isLoadingTechniciens } = useTechniciens();
  const { data: pieces, isLoading: isLoadingPieces } = usePieces();
  const { data: cout, refetch: refetchCout } = useCalculerCout(id!);

  const { mutate: demarrer, isPending: isDemarrage } = useDemarrerIntervention();
  const { mutate: ajouterPiece, isPending: isAdding } = useAjouterPiece();
  const { mutate: terminer, isPending: isTerminer } = useTerminerIntervention();
  const { mutate: retirerPiece, isPending: isRetirant } = useRetirerPiece();

  if (isLoadingIntervention) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  if (isErrorIntervention || !intervention) {
    return (
      <div className="text-destructive text-center p-4">
        <p>Intervention introuvable.</p>
        <Button variant="outline" onClick={() => navigate('/maintenance')} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  const bien = biens?.find((b) => b.id === intervention.bien_id);
  const technicien = techniciens?.find((t) => t.id === intervention.technicien_id);
  const piecesUtilisees = intervention.pieces_utilisees || [];

  const handleDemarrer = () => {
    setActionError(null);
    demarrer(id!, {
      onSuccess: () => refetch(),
      onError: (err: any) => setActionError(err.response?.data?.error || 'Erreur'),
    });
  };

  const handleAjouterPiece = () => {
    if (!selectedPiece) return;
    setActionError(null);
    ajouterPiece(
      { id: id!, data: { piece_id: selectedPiece, quantite } },
      {
        onSuccess: () => {
          refetch();
          setSelectedPiece('');
          setQuantite(1);
        },
        onError: (err: any) => setActionError(err.response?.data?.error || 'Erreur'),
      }
    );
  };

  const handleRetirerPiece = (pieceId: string) => {
    setActionError(null);
    retirerPiece(
      { interventionId: id!, pieceId },
      {
        onSuccess: () => {
          refetch();
          refetchCout();
        },
        onError: (err: any) => setActionError(err.response?.data?.error || 'Erreur'),
      }
    );
  };

  const handleTerminer = () => {
    setActionError(null);
    terminer(id!, {
      onSuccess: () => {
        refetch();
        refetchCout();
      },
      onError: (err: any) => setActionError(err.response?.data?.error || 'Erreur'),
    });
  };

  const handleCalculerCout = () => {
    setActionError(null);
    refetchCout();
  };

  const canAddPieces = intervention.statut === 'planifiee' || intervention.statut === 'en_cours';
  const isDataLoading = isLoadingBiens || isLoadingTechniciens || isLoadingPieces;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in space-y-6">
      <Button variant="ghost" onClick={() => navigate('/maintenance')} className="mb-2">
        ← Retour
      </Button>

      <Card className="card-glass">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">Détail de l'intervention</CardTitle>
            <p className="text-sm text-muted-foreground">
              ID: {intervention.id?.slice(0, 8) || 'Inconnu'}...
            </p>
          </div>
          <StatutBadge statut={intervention.statut} />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Bien</p>
              <p className="font-semibold">
                {isDataLoading ? 'Chargement...' : bien?.nom || intervention.bien_id?.slice(0, 8) || 'Inconnu'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Technicien</p>
              <p className="font-semibold">
                {isDataLoading
                  ? 'Chargement...'
                  : technicien
                  ? `${technicien.prenom} ${technicien.nom}`
                  : 'Non affecté'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Début</p>
              <p>{new Date(intervention.date_debut).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fin</p>
              <p>{new Date(intervention.date_fin).toLocaleString()}</p>
            </div>
            {cout !== undefined && (
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Coût total</p>
                <p className="text-xl font-bold text-primary">{cout} €</p>
              </div>
            )}
          </div>

          {/* Liste des pièces utilisées */}
          <div className="pt-4 border-t">
            <p className="font-medium mb-2">Pièces utilisées</p>
            {piecesUtilisees.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune pièce pour cette intervention.</p>
            ) : (
              <ul className="space-y-2">
                {piecesUtilisees.map((p) => (
                  <li key={p.id} className="flex items-center justify-between bg-muted/20 p-2 rounded-md">
                    <span>
                      {p.nom} (réf: {p.reference}) – {p.quantite} x {p.prix_unitaire} €
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRetirerPiece(p.id)}
                      disabled={isRetirant}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="ml-1">Retirer</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-2 border-t">
            <p className="font-medium">Actions</p>
            <div className="flex flex-wrap gap-3">
              {intervention.statut === 'planifiee' && (
                <Button onClick={handleDemarrer} disabled={isDemarrage} className="btn-elite">
                  {isDemarrage ? 'Démarrage...' : 'Démarrer'}
                </Button>
              )}

              {intervention.statut === 'en_cours' && (
                <Button onClick={handleTerminer} disabled={isTerminer} variant="outline">
                  {isTerminer ? 'Terminaison...' : 'Terminer'}
                </Button>
              )}

              {(intervention.statut === 'terminee' || intervention.statut === 'en_cours') && (
                <Button onClick={handleCalculerCout} variant="secondary">
                  Calculer le coût
                </Button>
              )}
            </div>

            {/* Ajout de pièce */}
            <div className="pt-4 border-t">
              <p className="font-medium mb-2">Ajouter une pièce détachée</p>
              {!canAddPieces && (
                <p className="text-sm text-muted-foreground mb-2">
                  ⚠️ L'ajout de pièces n'est possible que pour une intervention planifiée ou en cours.
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 min-w-[150px]">
                  <Label htmlFor="piece-select" className="text-xs">Pièce</Label>
                  <Select
                    onValueChange={setSelectedPiece}
                    value={selectedPiece}
                    disabled={!canAddPieces || isLoadingPieces}
                  >
                    <SelectTrigger id="piece-select">
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingPieces ? (
                        <SelectItem value="loading" disabled>Chargement...</SelectItem>
                      ) : pieces?.length === 0 ? (
                        <SelectItem value="empty" disabled>Aucune pièce</SelectItem>
                      ) : (
                        pieces?.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nom} (stock: {p.stock})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24">
                  <Label htmlFor="quantite" className="text-xs">Qté</Label>
                  <Input
                    id="quantite"
                    type="number"
                    min={1}
                    value={quantite}
                    onChange={(e) => setQuantite(Number(e.target.value))}
                    disabled={!canAddPieces}
                  />
                </div>
                <Button
                  onClick={handleAjouterPiece}
                  disabled={!canAddPieces || isAdding || !selectedPiece || isLoadingPieces}
                  variant="outline"
                >
                  {isAdding ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ajout...</> : 'Ajouter'}
                </Button>
              </div>
              {actionError && (
                <div className="mt-2 p-2 bg-destructive/10 text-destructive text-sm rounded">
                  {actionError}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};