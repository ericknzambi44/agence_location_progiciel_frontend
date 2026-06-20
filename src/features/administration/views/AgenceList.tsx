import { Link } from 'react-router-dom';
import { useAgencesActives } from '../hooks/useAdmin';
import { AgenceCard } from '../components/AgenceCard';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';

export const AgenceList = () => {
  const { data, isLoading, error } = useAgencesActives();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-center p-4">Erreur de chargement.</div>;
  }

  const agences = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Agences</h1>
        <Link to="nouvelle">
          <Button className="btn-elite w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Créer une agence
          </Button>
        </Link>
      </div>

      {agences.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Aucune agence active.</p>
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