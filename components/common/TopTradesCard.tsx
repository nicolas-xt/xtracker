import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Trade } from '../../types';

interface TopTradesCardProps {
  title: string;
  icon: React.ElementType;
  trades: Trade[];
  isGain: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`); // Always show seconds if no other parts, or if there are seconds

  return parts.join(' ');
};

export const TopTradesCard: React.FC<TopTradesCardProps> = ({ title, icon: Icon, trades, isGain }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${isGain ? 'text-b-green' : 'text-b-red'}`} />
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum trade para exibir.</p>
        ) : (
          <div className="space-y-2">
            {trades.map((trade, index) => (
              <div key={trade.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">#{index + 1} {trade.asset} {trade.side}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(trade.openTime).toLocaleDateString('pt-BR')} • {formatDuration(parseInt(trade.duration))}
                  </p>
                </div>
                <p className={`text-sm font-bold ${trade.result >= 0 ? 'text-b-green' : 'text-b-red'}`}>
                  {formatCurrency(trade.result)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
