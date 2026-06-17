import { useParams, useNavigate } from 'react-router-dom';
import { useBien, useChangerEtat } from '../hooks/useBiens';
import { EtatBadge } from '../components/EtatBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

export const BienDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: bien, isLoading, error } = useBien(id!);
  const { mutate: changerEtat, isPending } = useChangerEtat();

  if (isLoading) return <div>Chargement...</div>;
  if (error || !bien) return <div>Erreur ou bien introuvable.</div>;

  const handleChangerEtat = (nouvelEtat: typeof bien.etat) => {
    changerEtat({ id: bien.id, etat: nouvelEtat });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in">
      <Button variant="ghost" onClick={() => navigate('/stock')} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">{bien.nom}</CardTitle>
            <p className="text-sm text-muted-foreground">Réf: {bien.reference}</p>
          </div>
          <EtatBadge etat={bien.etat} className="text-base px-4 py-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Prix unitaire HT</p>
              <p className="font-semibold">{bien.prix_unitaire_ht} €</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date d'achat</p>
              <p>{bien.date_achat || 'Non renseignée'}</p>
            </div>
          </div>
          {bien.description && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p>{bien.description}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Changer l'état</p>
            <div className="flex flex-wrap gap-2">
              {(['disponible', 'en_maintenance', 'endommage', 'archive'] as const).map(
                (etat) => (
                  <Button
                    key={etat}
                    variant={bien.etat === etat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleChangerEtat(etat)}
                    disabled={isPending || bien.etat === etat}
                    className={bien.etat === etat ? 'btn-elite' : ''}
                  >
                    {etat.replace('_', ' ')}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};