import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PieChartProps {
  data: { label: string; valeur: number }[];
  title: string;
  colors?: string[];
}

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'];

export const PieChart = ({ data, title, colors = COLORS }: PieChartProps) => {
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
            <RePieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <Pie
                data={data}
                dataKey="valeur"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={({ name }) => name}  // Utilisation de name au lieu de label
                labelLine={false}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};