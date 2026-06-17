import { Link } from 'react-router-dom';
import { useInterventions } from '../hooks/useMaintenance';
import { StatutBadge } from '../components/StatutBadge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const InterventionList = () => {
  const { data, isLoading, error } = useInterventions();

  if (isLoading) return <div>Chargement des interventions...</div>;
  if (error) return <div className="text-destructive">Erreur de chargement.</div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Interventions</h1>
        <Link to="nouveau">
          <Button className="btn-elite w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Planifier
          </Button>
        </Link>
      </div>

      {data?.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Aucune intervention.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data?.map((inter) => (
            <Link to={inter.id} key={inter.id} className="block">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <CardTitle className="text-base">
                    Bien {inter.bien_id.slice(0, 8)} – {new Date(inter.date_debut).toLocaleDateString()}
                  </CardTitle>
                  <StatutBadge statut={inter.statut} />
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Du {new Date(inter.date_debut).toLocaleString()} au {new Date(inter.date_fin).toLocaleString()}</p>
                  {inter.cout_total !== undefined && <p>Coût total: {inter.cout_total} €</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};