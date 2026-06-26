import { Link } from 'react-router-dom';
import { useClients } from '../hooks/useLocation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, Users, Mail, Phone, MapPin, UserCircle } from 'lucide-react';

export const ClientList = () => {
  const { data: clients, isLoading, error } = useClients();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement des clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-6 border border-destructive/20 rounded-lg bg-destructive/5">
        <p className="font-semibold">Erreur de chargement</p>
        <p className="text-sm">Impossible de récupérer la liste des clients.</p>
      </div>
    );
  }

  const clientsList = clients || [];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Clients
          </h1>
          <p className="text-sm text-muted-foreground">
            {clientsList.length} client{clientsList.length > 1 ? 's' : ''} enregistré{clientsList.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link to="nouveau">
          <Button className="btn-elite w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Nouveau client
          </Button>
        </Link>
      </div>

      {/* Liste */}
      {clientsList.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg border-muted-foreground/20">
          <Users className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">Aucun client enregistré.</p>
          <p className="text-sm text-muted-foreground">Cliquez sur "Nouveau client" pour en ajouter un.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientsList.map((client) => (
            <Link key={client.id} to={client.id} className="block transition-transform hover:scale-[1.02] duration-200">
              <Card className="card-glass h-full hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-primary" />
                    {client.prenom} {client.nom}
                  </CardTitle>
                  <Badge variant={client.est_actif ? 'default' : 'secondary'}>
                    {client.est_actif ? 'Actif' : 'Inactif'}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate" title={client.email}>{client.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {client.telephone}
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="line-clamp-2">{client.adresse}</span>
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};