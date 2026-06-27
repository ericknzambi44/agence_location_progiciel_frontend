import { useModules, useActiverModule, useDesactiverModule } from '../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Settings, Power, PowerOff, Info } from 'lucide-react';

export const ModuleList = () => {
  const { data: modules, isLoading, error, refetch } = useModules();
  const { mutate: activer, isPending: isActivating } = useActiverModule();
  const { mutate: desactiver, isPending: isDesactivating } = useDesactiverModule();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement des modules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-6 border border-destructive/20 rounded-lg bg-destructive/5">
        <p className="font-semibold">Erreur de chargement</p>
        <p className="text-sm">Impossible de récupérer la liste des modules.</p>
      </div>
    );
  }

  const handleToggle = (id: string, currentActive: boolean) => {
    if (currentActive) {
      desactiver(id, { onSuccess: () => refetch() });
    } else {
      activer(id, { onSuccess: () => refetch() });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Modules</h1>
          <p className="text-sm text-muted-foreground">
            Activez ou désactivez les modules selon vos besoins.
          </p>
        </div>
      </div>

      {modules?.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg border-muted-foreground/20">
          <Settings className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">Aucun module configuré.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules?.map((module) => (
            <Card key={module.id} className="card-glass hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-lg">{module.nom}</CardTitle>
                <Badge variant={module.active ? 'default' : 'secondary'}>
                  {module.active ? (
                    <span className="flex items-center gap-1">
                      <Power className="h-3 w-3" /> Actif
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <PowerOff className="h-3 w-3" /> Inactif
                    </span>
                  )}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {module.description || 'Aucune description'}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    Code : <span className="font-mono">{module.code}</span>
                  </span>
                  <span>Ordre : {module.ordre_affichage}</span>
                </div>
                <Button
                  size="sm"
                  variant={module.active ? 'outline' : 'default'}
                  onClick={() => handleToggle(module.id, module.active)}
                  disabled={isActivating || isDesactivating}
                  className={!module.active ? 'btn-elite' : ''}
                >
                  {isActivating || isDesactivating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : null}
                  {module.active ? 'Désactiver' : 'Activer'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};