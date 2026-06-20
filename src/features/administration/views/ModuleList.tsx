import { useModules, useActiverModule, useDesactiverModule } from '../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ModuleList = () => {
  const { data, isLoading, refetch } = useModules();
  const { mutate: activer, isPending: isActivating } = useActiverModule();
  const { mutate: desactiver, isPending: isDesactivating } = useDesactiverModule();

  if (isLoading) return <div>Chargement des modules...</div>;

  const handleToggle = (id: string, currentActive: boolean) => {
    if (currentActive) {
      desactiver(id, { onSuccess: () => refetch() });
    } else {
      activer(id, { onSuccess: () => refetch() });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <h1 className="text-3xl font-bold">Modules</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.map((module) => (
          <Card key={module.id} className="card-glass">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>{module.nom}</CardTitle>
              <Badge variant={module.active ? 'default' : 'secondary'}>
                {module.active ? 'Actif' : 'Inactif'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{module.description}</p>
              <p className="text-xs">Code: {module.code} | Ordre: {module.ordre_affichage}</p>
              <Button
                size="sm"
                variant={module.active ? 'outline' : 'default'}
                onClick={() => handleToggle(module.id, module.active)}
                disabled={isActivating || isDesactivating}
                className={!module.active ? 'btn-elite' : ''}
              >
                {module.active ? 'Désactiver' : 'Activer'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};