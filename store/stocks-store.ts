import { create } from 'zustand';
import { Stock, StockQuote, SortOrder } from '@/types/stock';

interface StocksState {
  stocks: Record<string, Stock>;
  sortOrder: SortOrder;
  isConnected: boolean;
  connectionError: string | null;
  
  // Actions
  setSortOrder: (order: SortOrder) => void;
  updateStock: (quote: StockQuote) => void;
  setConnectionStatus: (connected: boolean, error?: string) => void;
  
  // Selectors
  getTopGainers: () => Stock[];
  getTopLosers: () => Stock[];
  getCurrentStocks: () => Stock[];
}

const PRICE_HISTORY_LIMIT = 20;

export const useStocksStore = create<StocksState>((set, get) => ({
  stocks: {},
  sortOrder: 'up',
  isConnected: false,
  connectionError: null,

  setSortOrder: (order: SortOrder) => {
    console.log('🔄 Mudando ordem para:', order);
    set({ sortOrder: order });
  },

  setConnectionStatus: (connected: boolean, error?: string) => {
    console.log('🔌 Status de conexão:', connected ? 'CONECTADO' : 'DESCONECTADO', error || '');
    set({ isConnected: connected, connectionError: error || null });
  },

  updateStock: (quote: StockQuote) => {
    const symbol = Object.keys(quote)[0];
    const newPrice = quote[symbol];
    
    if (!symbol || typeof newPrice !== 'number') {
      console.error('❌ Quote inválido:', quote);
      return;
    }

    console.log(`📊 STORE: Processando ${symbol} = R$ ${newPrice.toFixed(2)}`);

    set((state) => {
      const currentStock = state.stocks[symbol];
      const now = Date.now();
      
      // Se é a primeira cotação desta ação, define como preço de abertura
      if (!currentStock) {
        console.log(`🆕 NOVA AÇÃO: ${symbol} - preço inicial: R$ ${newPrice.toFixed(2)}`);
        const newStock = {
          symbol,
          price: newPrice,
          openPrice: newPrice,
          variation: 0,
          variationPercent: 0,
          priceHistory: [newPrice],
          lastUpdated: now,
          trend: 'neutral' as const,
        };
        
        const newState = {
          stocks: {
            ...state.stocks,
            [symbol]: newStock,
          },
        };
        
        console.log(`✅ AÇÃO ADICIONADA: Total de ações: ${Object.keys(newState.stocks).length}`);
        return newState;
      }

      // Calcula variação baseada no preço de abertura
      const variation = newPrice - currentStock.openPrice;
      const variationPercent = (variation / currentStock.openPrice) * 100;
      
      // Determina a tendência baseada na mudança de preço
      let trend: 'up' | 'down' | 'neutral' = 'neutral';
      if (newPrice > currentStock.price) trend = 'up';
      else if (newPrice < currentStock.price) trend = 'down';

      // Atualiza histórico de preços mantendo limite
      const updatedHistory = [...currentStock.priceHistory, newPrice];
      if (updatedHistory.length > PRICE_HISTORY_LIMIT) {
        updatedHistory.shift();
      }

      const updatedStock = {
        ...currentStock,
        price: newPrice,
        variation,
        variationPercent,
        priceHistory: updatedHistory,
        lastUpdated: now,
        trend,
      };

      console.log(`📈 ATUALIZADO ${symbol}:`, {
        price: `R$ ${newPrice.toFixed(2)}`,
        variation: `R$ ${variation.toFixed(2)}`,
        variationPercent: `${variationPercent.toFixed(2)}%`,
        trend
      });

      return {
        stocks: {
          ...state.stocks,
          [symbol]: updatedStock,
        },
      };
    });
  },

  getTopGainers: () => {
    const stocks = Object.values(get().stocks);
    const gainers = stocks
      .filter(stock => stock.variationPercent > 0)
      .sort((a, b) => b.variationPercent - a.variationPercent)
      .slice(0, 5);
    
    console.log('📊 Top gainers:', gainers.map(s => `${s.symbol}: +${s.variationPercent.toFixed(2)}%`));
    return gainers;
  },

  getTopLosers: () => {
    const stocks = Object.values(get().stocks);
    const losers = stocks
      .filter(stock => stock.variationPercent < 0)
      .sort((a, b) => a.variationPercent - b.variationPercent)
      .slice(0, 5);
    
    console.log('📉 Top losers:', losers.map(s => `${s.symbol}: ${s.variationPercent.toFixed(2)}%`));
    return losers;
  },

  getCurrentStocks: () => {
    const { sortOrder } = get();
    const allStocks = Object.values(get().stocks);
    
    if (allStocks.length === 0) {
      console.log('⚠️ Nenhuma ação disponível ainda');
      return [];
    }
    
    const stocks = sortOrder === 'up' ? get().getTopGainers() : get().getTopLosers();
    console.log(`📋 Retornando ${stocks.length} ações para ordem: ${sortOrder}`);
    console.log('📋 Ações retornadas:', stocks.map(s => `${s.symbol} (${s.variationPercent.toFixed(2)}%)`));
    return stocks;
  },
}));