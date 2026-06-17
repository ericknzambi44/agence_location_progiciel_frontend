import { Link } from 'react-router-dom';
import { useEmployesActifs } from '../hooks/useRH';
import { EmployeCard } from '../components/EmployeCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const EmployeList = () => {
  const { data, isLoading, error } = useEmployesActifs();

  if (isLoading) return <div>Chargement des employés...</div>;
  if (error) return <div className="text-destructive">Erreur de chargement.</div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Employés actifs</h1>
        <Link to="nouveau">
          <Button className="btn-elite w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Embaucher
          </Button>
        </Link>
      </div>

      {data?.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Aucun employé actif.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.map((emp) => (
            <EmployeCard key={emp.id} employe={emp} />
          ))}
        </div>
      )}
    </div>
  );
};