import { useState } from 'react';
import { useSynthese } from '../hooks/useStatistiques';
import { KpiCard } from '../components/KpiCard';
import { LineChart } from '../components/LineChart';
import { BarChart } from '../components/BarChart';
import { PieChart } from '../components/PieChart';
import { TableauInterventions } from '../components/TableauInterventions';
import { TableauPopulaire } from '../components/TableauPopulaire';
import { Loader2, TrendingUp, Users, Package, Wrench, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

const getDefaultDates = () => {
  const now = new Date();
  const debut = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const fin = now;
  return {
    debut: debut.toISOString().split('T')[0],
    fin: fin.toISOString().split('T')[0],
  };
};

export const StatistiquesPage = () => {
  const [debut, setDebut] = useState(getDefaultDates().debut);
  const [fin, setFin] = useState(getDefaultDates().fin);
  const { data, isLoading, error, refetch } = useSynthese({ debut, fin });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des données...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-6 border border-destructive/20 rounded-lg bg-destructive/5">
        <AlertCircle className="h-10 w-10 mx-auto mb-2" />
        <p className="font-semibold">Erreur de chargement</p>
        <p className="text-sm">Impossible de récupérer les statistiques.</p>
        <Button variant="outline" onClick={() => refetch()} className="mt-2">Réessayer</Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">Aucune donnée disponible pour cette période.</p>
      </div>
    );
  }

  // Transformation des données pour les graphiques (avec toNumber)
  const revenusData = data.revenus.map(r => ({ label: r.periode_label, valeur: toNumber(r.total) }));
  const contratsData = data.contrats.map(c => ({ label: c.periode_label, valeur: toNumber(c.total) }));
  const biensPop = data.biens_populaires.map(b => ({ label: b.nom, valeur: toNumber(b.revenus) }));
  const piecesPop = data.pieces_populaires.map(p => ({ label: p.nom, valeur: toNumber(p.quantite_totale) }));
  const techData = data.interventions_techniciens.map(t => ({ label: t.nom, valeur: toNumber(t.cout_total) }));

  // Totaux avec conversion sécurisée
  const totalRevenus = data.revenus.reduce((acc, r) => acc + toNumber(r.total), 0);
  const totalContrats = data.contrats.reduce((acc, c) => acc + toNumber(c.total), 0);

  // Taux d'occupation converti
  const tauxOccupation = toNumber(data.taux_occupation);

  // Données pour le camembert des statuts
  const statutData = data.contrats_statut ? [
    { label: 'Actifs', valeur: toNumber(data.contrats_statut.actif) },
    { label: 'Terminés', valeur: toNumber(data.contrats_statut.termine) },
    { label: 'Annulés', valeur: toNumber(data.contrats_statut.annule) },
  ] : [];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* En-tête avec sélecteur de période */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord statistique</h1>
          <p className="text-sm text-muted-foreground">
            Analyse de l'activité du {debut} au {fin}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <Label htmlFor="debut" className="text-xs">Début</Label>
            <Input
              id="debut"
              type="date"
              value={debut}
              onChange={(e) => setDebut(e.target.value)}
              className="w-36 h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="fin" className="text-xs">Fin</Label>
            <Input
              id="fin"
              type="date"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              className="w-36 h-8 text-sm"
            />
          </div>
          <Button size="sm" onClick={() => refetch()} className="mt-1">Appliquer</Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Revenus totaux"
          value={`${totalRevenus.toFixed(2)} €`}
          icon={<DollarSign className="h-4 w-4 text-primary" />}
        />
        <KpiCard
          title="Contrats"
          value={totalContrats}
          icon={<Package className="h-4 w-4 text-primary" />}
        />
        <KpiCard
          title="Taux d'occupation"
          value={`${(tauxOccupation * 100).toFixed(1)}%`}
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
        />
        <KpiCard
          title="Clients actifs"
          value={toNumber(data.clients_actifs)}
          icon={<Users className="h-4 w-4 text-primary" />}
        />
      </div>

      {/* Graphiques d'évolution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LineChart
          data={revenusData}
          title="Évolution des revenus"
          color="#3b82f6"
          unit="€"
        />
        <LineChart
          data={contratsData}
          title="Évolution des contrats"
          color="#10b981"
          unit="contrats"
        />
      </div>

      {/* Biens et pièces populaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarChart
          data={biensPop}
          title="Biens les plus rentables"
          color="#f59e0b"
          unit="€"
        />
        <BarChart
          data={piecesPop}
          title="Pièces les plus utilisées"
          color="#8b5cf6"
          unit="unités"
        />
      </div>

      {/* Répartition des contrats et coût par technicien */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PieChart
          data={statutData}
          title="Répartition des contrats par statut"
        />
        <BarChart
          data={techData}
          title="Coût total par technicien"
          color="#ef4444"
          unit="€"
        />
      </div>

      {/* Détail des interventions */}
      <TableauInterventions data={data.statistiques_interventions} />
    </div>
  );
};