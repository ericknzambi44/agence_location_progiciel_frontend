import { Link } from 'react-router-dom';
import { useBiens } from '../hooks/useBiens';
import { BienCard } from '../components/BienCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const BienList = () => {
  const { data, isLoading, error } = useBiens();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Chargement des biens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-4">
        Erreur lors du chargement des biens.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Gestion des biens</h1>
        <Link to="nouveau">
          <Button className="btn-elite w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un bien
          </Button>
        </Link>
      </div>

      {data?.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Aucun bien enregistré.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.map((bien) => (
            <BienCard key={bien.id} bien={bien} />
          ))}
        </div>
      )}
    </div>
  );
};