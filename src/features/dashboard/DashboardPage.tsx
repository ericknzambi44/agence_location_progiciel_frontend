import { Link } from 'react-router-dom';
import { useBiens } from '@/features/stock/hooks/useBiens';
import { useEmployesActifs } from '@/features/rh/hooks/useRH';
import { useInterventions } from '@/features/maintenance/hooks/useMaintenance';
import { useAgencesActives } from '@/features/administration/hooks/useAdmin';
import { useContrats } from '@/features/location/hooks/useLocation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Users,
  Wrench,
  Building2,
  PlusCircle,
  CalendarPlus,
  UserPlus,
  HousePlus,
  FileText,
  AlertTriangle,
  Clock,
  DollarSign,
} from 'lucide-react';

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

/**
 * Page d'accueil (Dashboard) du progiciel.
 * Affiche des indicateurs clés, des alertes et des actions rapides.
 */
export const DashboardPage = () => {
  // Données en parallèle (React Query)
  const { data: biens } = useBiens();
  const { data: employes } = useEmployesActifs();
  const { data: interventions } = useInterventions();
  const { data: agences } = useAgencesActives();
  const { data: contrats } = useContrats();

  // --- Calculs des indicateurs ---
  const totalBiens = biens?.length || 0;
  const biensDisponibles = biens?.filter(b => b.etat === 'disponible').length || 0;
  const biensMaintenance = biens?.filter(b => b.etat === 'en_maintenance').length || 0;
  const biensEndomages = biens?.filter(b => b.etat === 'endommage').length || 0;

  // Stock faible (ex: biens avec prix unitaire < 50, à adapter selon votre logique)
  const biensFaibleStock = biens?.filter(b => toNumber(b.prix_unitaire_ht) < 50).length || 0;

  const totalEmployes = employes?.length || 0;
  const interventionsEnCours = interventions?.filter(i => i.statut === 'en_cours').length || 0;
  const interventionsPlanifiees = interventions?.filter(i => i.statut === 'planifiee').length || 0;
  const totalAgences = agences?.length || 0;

  const contratsActifs = contrats?.filter(c => c.statut === 'actif').length || 0;
  const contratsTotal = contrats?.length || 0;

  // Montant total des contrats actifs (avec conversion robuste)
  const montantTotalContrats = contrats?.reduce((acc, c) => {
    const montant = toNumber(c.montant_total);
    return acc + montant;
  }, 0) || 0;

  // Dernières interventions (5 dernières)
  const dernieresInterventions = interventions?.slice(0, 5) || [];

  // Derniers contrats (5 derniers)
  const derniersContrats = contrats?.slice(0, 5) || [];

  // Métriques principales
  const metrics = [
    {
      title: 'Biens',
      icon: Package,
      value: totalBiens,
      sub: `${biensDisponibles} disponibles · ${biensMaintenance} en maintenance · ${biensEndomages} endommagés`,
      color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
      link: '/stock',
      actionLabel: 'Voir tout',
    },
    {
      title: 'Employés',
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
      sub: `${interventionsEnCours} en cours · ${interventionsPlanifiees} planifiées`,
      color: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
      link: '/maintenance',
      actionLabel: 'Voir tout',
    },
    {
      title: 'Contrats actifs',
      icon: FileText,
      value: contratsActifs,
      sub: `${contratsTotal} total · ${montantTotalContrats.toFixed(2)} € estimés`,
      color: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
      link: '/location/contrats',
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
    { label: 'Nouveau contrat', icon: FileText, link: '/location/contrats/nouveau' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
      </div>

      {/* Alertes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {biensFaibleStock > 0 && (
          <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-900/20">
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <CardTitle className="text-sm font-medium">Alertes stock</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {biensFaibleStock} bien{biensFaibleStock > 1 ? 's' : ''} avec un prix unitaire faible.
              </p>
              <Link to="/stock" className="text-xs text-primary hover:underline mt-2 inline-block">
                Voir les biens →
              </Link>
            </CardContent>
          </Card>
        )}

        {interventionsEnCours > 0 && (
          <Card className="border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/20">
            <CardHeader className="flex flex-row items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-sm font-medium">Interventions en cours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {interventionsEnCours} intervention{interventionsEnCours > 1 ? 's' : ''} en cours.
              </p>
              <Link to="/maintenance" className="text-xs text-primary hover:underline mt-2 inline-block">
                Voir les interventions →
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <p className="text-xs text-muted-foreground mt-1 truncate">{metric.sub}</p>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.link}>
              <Button variant="outline" className="w-full h-auto py-4 flex items-center gap-3 justify-center hover:bg-primary/5 transition-colors">
                <action.icon className="h-5 w-5" />
                <span className="text-sm">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Dernières interventions et derniers contrats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dernières interventions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Dernières interventions</h2>
          {dernieresInterventions.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune intervention récente.</p>
          ) : (
            <div className="bg-card border rounded-lg p-4 space-y-3">
              {dernieresInterventions.map((inter) => (
                <Link to={`/maintenance/${inter.id}`} key={inter.id} className="block">
                  <div className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0 hover:bg-muted/20 p-2 rounded-md transition-colors">
                    <div>
                      <p className="font-medium text-sm">Bien {inter.bien_id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(inter.date_debut).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {inter.cout_total !== undefined && (
                        <span className="text-xs font-semibold text-primary">
                          {toNumber(inter.cout_total).toFixed(2)} €
                        </span>
                      )}
                      <Badge
                        variant={
                          inter.statut === 'terminee'
                            ? 'default'
                            : inter.statut === 'en_cours'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="text-xs"
                      >
                        {inter.statut.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link to="/maintenance" className="text-sm text-primary hover:underline mt-2 inline-block">
            Voir toutes les interventions →
          </Link>
        </div>

        {/* Derniers contrats */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Derniers contrats</h2>
          {derniersContrats.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucun contrat récent.</p>
          ) : (
            <div className="bg-card border rounded-lg p-4 space-y-3">
              {derniersContrats.map((contrat) => (
                <Link to={`/location/contrats/${contrat.id}`} key={contrat.id} className="block">
                  <div className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0 hover:bg-muted/20 p-2 rounded-md transition-colors">
                    <div>
                      <p className="font-medium text-sm">Contrat #{contrat.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {contrat.date_debut} → {contrat.date_fin}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary">
                        {toNumber(contrat.montant_total).toFixed(2)} €
                      </span>
                      <Badge
                        variant={contrat.statut === 'actif' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {contrat.statut}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link to="/location/contrats" className="text-sm text-primary hover:underline mt-2 inline-block">
            Voir tous les contrats →
          </Link>
        </div>
      </div>
    </div>
  );
};