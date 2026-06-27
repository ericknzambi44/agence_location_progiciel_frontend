import { Link } from 'react-router-dom';
import { useTechniciens } from '../hooks/useMaintenance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2, Users, Mail, DollarSign } from 'lucide-react';

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

export const TechnicienList = () => {
  const { data: techniciens, isLoading, error } = useTechniciens();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement des techniciens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-6 border border-destructive/20 rounded-lg bg-destructive/5">
        <p className="font-semibold">Erreur de chargement</p>
        <p className="text-sm">Impossible de récupérer la liste des techniciens.</p>
      </div>
    );
  }

  const list = techniciens || [];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Techniciens
          </h1>
          <p className="text-sm text-muted-foreground">
            {list.length} technicien{list.length > 1 ? 's' : ''} enregistré{list.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link to="nouveau">
          <Button className="btn-elite w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un technicien
          </Button>
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg border-muted-foreground/20">
          <Users className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">Aucun technicien enregistré.</p>
          <p className="text-sm text-muted-foreground">Cliquez sur "Ajouter un technicien" pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((tech) => {
            // Conversion robuste du taux horaire
            const taux = toNumber(tech.cout_horaire);
            return (
              <Card key={tech.id} className="card-glass hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {tech.prenom} {tech.nom}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {tech.email}
                  </p>
                  <p className="flex items-center gap-2 font-semibold">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    {taux.toFixed(2)} €/h
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};