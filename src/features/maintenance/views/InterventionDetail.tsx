import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  useIntervention,
  useDemarrerIntervention,
  useAjouterPiece,
  useTerminerIntervention,
  useCalculerCout,
  usePieces,
} from '../hooks/useMaintenance';
import { StatutBadge } from '../components/StatutBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const InterventionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: intervention, isLoading, refetch } = useIntervention(id!);
  const { mutate: demarrer, isPending: isDemarrage } = useDemarrerIntervention();
  const { mutate: ajouterPiece, isPending: isAdding } = useAjouterPiece();
  const { mutate: terminer, isPending: isTerminer } = useTerminerIntervention();
  const { data: pieces } = usePieces();
  const { data: cout, refetch: refetchCout } = useCalculerCout(id!);

  const [selectedPiece, setSelectedPiece] = useState('');
  const [quantite, setQuantite] = useState(1);

  if (isLoading || !intervention) return <div>Chargement...</div>;

  const handleDemarrer = () => {
    demarrer(id!, { onSuccess: () => refetch() });
  };

  const handleAjouterPiece = () => {
    if (!selectedPiece) return;
    ajouterPiece(
      { id: id!, data: { piece_id: selectedPiece, quantite } },
      { onSuccess: () => refetch() }
    );
    setSelectedPiece('');
    setQuantite(1);
  };

  const handleTerminer = () => {
    terminer(id!, {
      onSuccess: () => {
        refetch();
        refetchCout();
      },
    });
  };

  const handleCalculerCout = () => {
    refetchCout();
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in space-y-6">
      <Button variant="ghost" onClick={() => navigate('/maintenance')} className="mb-2">
        ← Retour
      </Button>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">Intervention</CardTitle>
            <p className="text-sm text-muted-foreground">
              Bien: {intervention.bien_id.slice(0, 8)} – Du {new Date(intervention.date_debut).toLocaleString()}
            </p>
          </div>
          <StatutBadge statut={intervention.statut} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><strong>Début:</strong> {new Date(intervention.date_debut).toLocaleString()}</div>
            <div><strong>Fin:</strong> {new Date(intervention.date_fin).toLocaleString()}</div>
            <div><strong>Technicien:</strong> {intervention.technicien_id || 'Non affecté'}</div>
            {cout !== undefined && <div><strong>Coût total:</strong> {cout} €</div>}
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {intervention.statut === 'planifiee' && (
              <Button onClick={handleDemarrer} disabled={isDemarrage} className="btn-elite">
                Démarrer
              </Button>
            )}
            {(intervention.statut === 'planifiee' || intervention.statut === 'en_cours') && (
              <>
                <div className="flex flex-col sm:flex-row gap-2 items-end">
                  <div>
                    <Label>Pièce</Label>
                    <Select onValueChange={setSelectedPiece} value={selectedPiece}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        {pieces?.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nom} (stock: {p.stock})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      min={1}
                      value={quantite}
                      onChange={(e) => setQuantite(Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
                  <Button onClick={handleAjouterPiece} disabled={isAdding || !selectedPiece}>
                    Ajouter pièce
                  </Button>
                </div>
              </>
            )}
            {intervention.statut === 'en_cours' && (
              <Button onClick={handleTerminer} disabled={isTerminer} variant="outline">
                Terminer
              </Button>
            )}
            {(intervention.statut === 'terminee' || intervention.statut === 'en_cours') && (
              <Button onClick={handleCalculerCout} variant="outline">
                Calculer le coût
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};