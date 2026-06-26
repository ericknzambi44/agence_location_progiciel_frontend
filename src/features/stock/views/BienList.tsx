import { Link } from 'react-router-dom';
import { useBiens } from '../hooks/useBiens';
import { BienCard } from '../components/BienCard';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Package } from 'lucide-react';

export const BienList = () => {
  const { data: biens, isLoading, error } = useBiens();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement des biens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-6 border border-destructive/20 rounded-lg bg-destructive/5">
        <p className="font-semibold">Erreur de chargement</p>
        <p className="text-sm">Impossible de récupérer la liste des biens.</p>
      </div>
    );
  }

  const bienList = biens || [];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            Gestion des biens
          </h1>
          <p className="text-sm text-muted-foreground">
            {bienList.length} bien{bienList.length > 1 ? 's' : ''} enregistré{bienList.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link to="nouveau">
          <Button className="btn-elite w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un bien
          </Button>
        </Link>
      </div>

      {bienList.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg border-muted-foreground/20">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">Aucun bien enregistré.</p>
          <p className="text-sm text-muted-foreground">Cliquez sur "Ajouter un bien" pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bienList.map((bien) => (
            <BienCard key={bien.id} bien={bien} />
          ))}
        </div>
      )}
    </div>
  );
};