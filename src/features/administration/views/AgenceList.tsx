import { Link } from 'react-router-dom';
import { useAgencesActives } from '../hooks/useAdmin';
import { AgenceCard } from '../components/AgenceCard';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Building2 } from 'lucide-react';

export const AgenceList = () => {
  const { data, isLoading, error } = useAgencesActives();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement des agences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-6 border border-destructive/20 rounded-lg bg-destructive/5">
        <p className="font-semibold">Erreur de chargement</p>
        <p className="text-sm">Impossible de récupérer la liste des agences.</p>
      </div>
    );
  }

  const agences = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Agences
          </h1>
          <p className="text-sm text-muted-foreground">
            {agences.length} agence{agences.length > 1 ? 's' : ''} active{agences.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link to="nouvelle">
          <Button className="btn-elite w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Créer une agence
          </Button>
        </Link>
      </div>

      {agences.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg border-muted-foreground/20">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">Aucune agence active.</p>
          <p className="text-sm text-muted-foreground">Cliquez sur "Créer une agence" pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agences.map((agence) => (
            <AgenceCard key={agence.id} agence={agence} />
          ))}
        </div>
      )}
    </div>
  );
};