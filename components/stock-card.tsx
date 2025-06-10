'use client';

import { useEffect, useState } from 'react';
import { Stock } from '@/types/stock';
import { MiniChart } from './mini-chart';
import { cn } from '@/lib/utils';

interface StockCardProps {
  stock: Stock;
}

export function StockCard({ stock }: StockCardProps) {
  const [flashClass, setFlashClass] = useState('');

  // Efeito para flash de cor quando o preço muda
  useEffect(() => {
    if (stock.trend === 'up') {
      setFlashClass('price-flash-green');
    } else if (stock.trend === 'down') {
      setFlashClass('price-flash-red');
    }

    const timer = setTimeout(() => setFlashClass(''), 500);
    return () => clearTimeout(timer);
  }, [stock.price, stock.trend]);

  const isPositive = stock.variationPercent >= 0;
  const variationColor = isPositive ? 'text-green-500' : 'text-red-500';
  const arrow = isPositive ? '↑' : '↓';

  // Gera iniciais do símbolo da ação para o avatar
  const initials = stock.symbol.substring(0, 2).toUpperCase();

  return (
    <div className={cn('stock-card', flashClass)}>
      {/* Header do card com logo e informações */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
          <div>
            <div className="text-sm text-gray-600">AES Eletropaulo</div>
            <div className="text-xs text-gray-500">{stock.symbol}</div>
          </div>
        </div>
      </div>

      {/* Preço atual */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          PREÇO DO ATIVO
        </div>
        <div className={cn('text-xl font-semibold transition-colors', variationColor)}>
          R$ {stock.price.toFixed(2)} {arrow}
        </div>
      </div>

      {/* Mini gráfico */}
      <div className="h-16">
        <MiniChart data={stock.priceHistory} />
      </div>
    </div>
  );
}