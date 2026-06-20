import { Link } from 'react-router-dom';
import { useBiens } from '@/features/stock/hooks/useBiens';
import { useEmployesActifs } from '@/features/rh/hooks/useRH';
import { useInterventions } from '@/features/maintenance/hooks/useMaintenance';
import { useAgencesActives } from '@/features/administration/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Users, Wrench, Building2, PlusCircle, CalendarPlus, UserPlus, HousePlus } from 'lucide-react';

/**
 * Page d'accueil (Dashboard) du progiciel.
 * Affiche des indicateurs clés pour chaque module et des liens d'action rapide.
 */
export const DashboardPage = () => {
  // Données en parallèle (utilisation de React Query déjà en cache)
  const { data: biens } = useBiens();
  const { data: employes } = useEmployesActifs();
  const { data: interventions } = useInterventions();
  const { data: agences } = useAgencesActives();

  // Calculs des indicateurs
  const totalBiens = biens?.length || 0;
  const biensDisponibles = biens?.filter(b => b.etat === 'disponible').length || 0;
  const totalEmployes = employes?.length || 0;
  const interventionsEnCours = interventions?.filter(i => i.statut === 'en_cours').length || 0;
  const totalAgences = agences?.length || 0;

  // Cartes avec métriques
  const metrics = [
    {
      title: 'Biens',
      icon: Package,
      value: totalBiens,
      sub: `${biensDisponibles} disponibles`,
      color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
      link: '/stock',
      actionLabel: 'Voir tout',
    },
    {
      title: 'Employés actifs',
      icon: Users,
      value: totalEmployes,
      sub: `${totalEmployes} actif(s)`,
      color: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
      link: '/rh',
      actionLabel: 'Voir tout',
    },
    {
      title: 'Interventions',
      icon: Wrench,
      value: interventions?.length || 0,
      sub: `${interventionsEnCours} en cours`,
      color: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
      link: '/maintenance',
      actionLabel: 'Voir tout',
    },
    {
      title: 'Agences',
      icon: Building2,
      value: totalAgences,
      sub: `${totalAgences} active(s)`,
      color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
      link: '/administration',
      actionLabel: 'Gérer',
    },
  ];

  const quickActions = [
    { label: 'Ajouter un bien', icon: PlusCircle, link: '/stock/nouveau' },
    { label: 'Planifier une intervention', icon: CalendarPlus, link: '/maintenance/nouveau' },
    { label: 'Embaucher un employé', icon: UserPlus, link: '/rh/nouveau' },
    { label: 'Créer une agence', icon: HousePlus, link: '/administration/nouvelle' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title} className="card-glass hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`p-2 rounded-full ${metric.color}`}>
                <metric.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.sub}</p>
              <Link to={metric.link} className="text-sm text-primary hover:underline block mt-2">
                {metric.actionLabel} →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.link}>
              <Button variant="outline" className="w-full h-auto py-4 flex items-center gap-3 justify-center hover:bg-primary/5 transition-colors">
                <action.icon className="h-5 w-5" />
                <span>{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Section supplémentaire – Dernières interventions (exemple) */}
      {interventions && interventions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Interventions récentes</h2>
          <div className="bg-card border rounded-lg p-4 space-y-2">
            {interventions.slice(0, 3).map((inter) => (
              <div key={inter.id} className="flex justify-between items-center border-b last:border-0 py-2">
                <div>
                  <p className="font-medium">Bien {inter.bien_id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">{new Date(inter.date_debut).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                  inter.statut === 'terminee' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  inter.statut === 'en_cours' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                }`}>
                  {inter.statut.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};