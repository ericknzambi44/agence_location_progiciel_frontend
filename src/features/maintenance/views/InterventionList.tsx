import { Link } from 'react-router-dom';
import { useInterventions } from '../hooks/useMaintenance';
import { StatutBadge } from '../components/StatutBadge';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Wrench, Calendar, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const InterventionList = () => {
  const { data: interventions, isLoading, error } = useInterventions();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement des interventions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-6 border border-destructive/20 rounded-lg bg-destructive/5">
        <p className="font-semibold">Erreur de chargement</p>
        <p className="text-sm">Impossible de récupérer la liste des interventions.</p>
      </div>
    );
  }

  const list = interventions || [];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wrench className="h-8 w-8 text-primary" />
            Interventions
          </h1>
          <p className="text-sm text-muted-foreground">
            {list.length} intervention{list.length > 1 ? 's' : ''} enregistrée{list.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link to="nouveau">
          <Button className="btn-elite w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Planifier
          </Button>
        </Link>
      </div>

      {/* Liste */}
      {list.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg border-muted-foreground/20">
          <Wrench className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">Aucune intervention en cours.</p>
          <p className="text-sm text-muted-foreground">Cliquez sur "Planifier" pour en créer une.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {list.map((inter) => {
            // Convertir le coût total en nombre pour éviter l'erreur toFixed()
            const coutTotal = typeof inter.cout_total === 'string'
              ? parseFloat(inter.cout_total)
              : inter.cout_total;

            return (
              <Link to={inter.id} key={inter.id} className="block transition-transform hover:scale-[1.01] duration-200">
                <Card className="card-glass hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base font-semibold">
                        Bien #{inter.bien_id.slice(0, 8)}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(inter.date_debut).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <StatutBadge statut={inter.statut} />
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(inter.date_debut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} →{' '}
                          {new Date(inter.date_fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {coutTotal !== undefined && !isNaN(coutTotal) && (
                        <div className="flex items-center gap-1 text-primary font-medium">
                          <DollarSign className="h-4 w-4" />
                          {coutTotal.toFixed(2)} €
                        </div>
                      )}
                      <div className="flex-1" />
                      <span className="text-xs text-muted-foreground">
                        Technicien: {inter.technicien_id ? inter.technicien_id.slice(0, 8) : 'Non assigné'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};