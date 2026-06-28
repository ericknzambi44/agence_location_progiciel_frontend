import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatistiquesInterventions } from '../types/statistiques.types';

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

interface TableauInterventionsProps {
  data: StatistiquesInterventions;
}

export const TableauInterventions = ({ data }: TableauInterventionsProps) => {
  if (!data) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Détail des interventions</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Aucune donnée disponible.</p></CardContent>
      </Card>
    );
  }

  // Conversion sécurisée des valeurs
  const nbTotal = toNumber(data.nb_total);
  const coutMoyen = toNumber(data.cout_moyen);
  const dureeMoyenne = toNumber(data.duree_moyenne_heures);
  const dureeMin = toNumber(data.duree_min_heures);
  const dureeMax = toNumber(data.duree_max_heures);
  const ecartType = toNumber(data.ecart_type_heures);

  const rows = [
    { label: "Nombre total d'interventions", value: nbTotal },
    { label: 'Coût moyen', value: `${coutMoyen.toFixed(2)} €` },
    { label: 'Durée moyenne', value: `${dureeMoyenne.toFixed(1)} h` },
    { label: 'Durée minimale', value: `${dureeMin.toFixed(1)} h` },
    { label: 'Durée maximale', value: `${dureeMax.toFixed(1)} h` },
    { label: 'Écart-type', value: `${ecartType.toFixed(1)} h` },
  ];

  return (
    <Card className="card-glass">
      <CardHeader><CardTitle className="text-sm">Détail des interventions</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {rows.map((row, idx) => (
            <div key={idx} className="flex justify-between border-b py-1">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};