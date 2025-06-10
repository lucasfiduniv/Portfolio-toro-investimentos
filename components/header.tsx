'use client';

import { useStocksStore } from '@/store/stocks-store';
import { SortOrder } from '@/types/stock';
import { cn } from '@/lib/utils';

export function Header() {
  const { sortOrder, setSortOrder } = useStocksStore();

  const handleSortChange = (order: SortOrder) => {
    setSortOrder(order);
  };

  return (
    <header className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src='https://www.toroinvestimentos.com.br/assets-next/logos/Logo_Toro_Branco_RGB.svg'
              alt="Logo Toro Investimentos"
              className="h-10 w-auto" // <-- CORREÇÃO AQUI: Define um tamanho para a imagem
            /> </div>
        </div>
      </div>

      {/* Seção principal com título e filtros */}
      <div className="bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Explore o mercado
            </h1>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 mr-2">Ordenar:</span>
              <button
                onClick={() => handleSortChange('up')}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  sortOrder === 'up'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                Em Alta
              </button>
              <button
                onClick={() => handleSortChange('down')}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  sortOrder === 'down'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                Em Baixa
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}