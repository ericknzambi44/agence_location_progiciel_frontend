import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TableauPopulaireProps {
  title: string;
  data: { label: string; value: number; detail?: string }[];
  unit?: string;
}

export const TableauPopulaire = ({ title, data, unit = '' }: TableauPopulaireProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Aucune donnée.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-glass">
      <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          {data.map((item, idx) => (
            <li key={idx} className="flex justify-between border-b py-1">
              <span>{item.label}</span>
              <span className="font-medium">
                {item.value.toFixed(2)} {unit}
                {item.detail && <span className="text-muted-foreground ml-2 text-xs">({item.detail})</span>}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};