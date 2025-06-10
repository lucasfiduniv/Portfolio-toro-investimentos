'use client';

import { useStocksStore } from '@/store/stocks-store';
import { StockCard } from './stock-card';
import { ConnectionStatus } from './connection-status';

export function StocksGrid() {
  const { getCurrentStocks, isConnected, sortOrder } = useStocksStore();
  const stocks = getCurrentStocks();

  const title = sortOrder === 'up' ? 'Ações em Alta' : 'Ações em Baixa';
  const emptyMessage = sortOrder === 'up' 
    ? 'Nenhuma ação em alta no momento' 
    : 'Nenhuma ação em baixa no momento';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ConnectionStatus />
      
      {!isConnected && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500">Aguardando conexão com o simulador...</p>
        </div>
      )}

      {isConnected && stocks.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}

      {stocks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {stocks.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}