'use client';

import { useStocksStore } from '@/store/stocks-store';
import { AlertCircle, TrendingUp, Clock, Activity } from 'lucide-react';

export function ConnectionStatus() {
  const { isConnected, connectionError, stocks } = useStocksStore();
  const stockCount = Object.keys(stocks).length;

  if (isConnected && stockCount > 0) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm mb-4">
        <Activity className="h-4 w-4 animate-pulse" />
        <span>Simulador ativo - {stockCount} ações sendo monitoradas</span>
      </div>
    );
  }

  if (isConnected && stockCount === 0) {
    return (
      <div className="flex items-center gap-2 text-blue-600 text-sm mb-4">
        <Clock className="h-4 w-4 animate-spin" />
        <span>Simulador conectado - Carregando dados iniciais...</span>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Clock className="h-5 w-5 text-blue-500 mt-0.5 animate-pulse" />
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-medium">
            <span>Iniciando simulador de cotações...</span>
          </div>
          {connectionError && (
            <p className="text-red-600 text-sm mt-1 font-medium">{connectionError}</p>
          )}
          <div className="text-blue-600 text-sm mt-2">
            <p className="mb-2">
              <strong>Sistema de simulação realística:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Preços baseados em cotações reais</li>
              <li>Volatilidade específica por ação</li>
              <li>Movimentos aleatórios controlados</li>
              <li>Atualizações a cada 2 segundos</li>
            </ul>
            <p className="mt-2 text-xs">
              <strong>Ações:</strong> PETR4, VALE3, ITUB4, BBDC4, ABEV3
            </p>
            <p className="mt-1 text-xs text-blue-500">
              Abra o console do navegador (F12) para ver logs detalhados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}