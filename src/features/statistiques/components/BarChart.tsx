import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BarChartProps {
  data: { label: string; valeur: number }[];
  title: string;
  color?: string;
  unit?: string;
}

export const BarChart = ({ data, title, color = '#2563eb', unit = '' }: BarChartProps) => {
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
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value) => `${value} ${unit}`}
                contentStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="valeur" fill={color} radius={[4, 4, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};