import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: number | string;
  sub?: string;
  icon?: ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

export const KpiCard = ({ title, value, sub, icon, trend, className }: KpiCardProps) => {
  return (
    <Card className={cn('card-glass hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="p-2 bg-primary/10 rounded-full">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        {trend && (
          <p className={cn('text-xs mt-1', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}%
          </p>
        )}
      </CardContent>
    </Card>
  );
};