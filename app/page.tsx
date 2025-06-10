'use client';

import { Header } from '@/components/header';
import { StocksGrid } from '@/components/stocks-grid';
import { useStockSimulator } from '@/hooks/use-stock-simulator';

export default function Home() {
  // Inicia simulador de cotações
  useStockSimulator();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <StocksGrid />
      </main>
    </div>
  );
}