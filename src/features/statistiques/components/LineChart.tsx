import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LineChartProps {
  data: { label: string; valeur: number }[];
  title: string;
  color?: string;
  unit?: string;
}

export const LineChart = ({ data, title, color = '#2563eb', unit = '' }: LineChartProps) => {
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
            <ReLineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value) => `${value} ${unit}`}
                contentStyle={{ fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="valeur"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};