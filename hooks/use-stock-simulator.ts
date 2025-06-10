'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useStocksStore } from '@/store/stocks-store';

// Ações brasileiras com dados base realísticos
const BRAZILIAN_STOCKS = [
  { symbol: 'PETR4', name: 'Petrobras', basePrice: 38.50, volatility: 0.025 },
  { symbol: 'VALE3', name: 'Vale', basePrice: 65.20, volatility: 0.020 },
  { symbol: 'ITUB4', name: 'Itaú Unibanco', basePrice: 25.80, volatility: 0.015 },
  { symbol: 'BBDC4', name: 'Bradesco', basePrice: 12.45, volatility: 0.015 },
  { symbol: 'ABEV3', name: 'Ambev', basePrice: 14.30, volatility: 0.012 },
];

const UPDATE_INTERVAL = 2000; // 2 segundos

interface StockState {
  currentPrice: number;
  trend: number;
  momentum: number;
  lastUpdate: number;
}

export const useStockSimulator = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const stockStatesRef = useRef<Map<string, StockState>>(new Map());
  const { updateStock, setConnectionStatus } = useStocksStore();

  // Inicializa estados das ações
  const initializeStockStates = useCallback(() => {
    console.log('🚀 Inicializando simulador de ações...');
    BRAZILIAN_STOCKS.forEach(stock => {
      const initialState = {
        currentPrice: stock.basePrice,
        trend: (Math.random() - 0.5) * 0.3,
        momentum: Math.random() * 0.2 + 0.1,
        lastUpdate: Date.now()
      };
      stockStatesRef.current.set(stock.symbol, initialState);
      console.log(`✅ ${stock.symbol} inicializado: R$ ${stock.basePrice.toFixed(2)}`);
    });
    console.log(`📊 Total de ${BRAZILIAN_STOCKS.length} ações inicializadas`);
  }, []);

  // Gera movimento realístico de preço
  const generatePriceMovement = (stock: typeof BRAZILIAN_STOCKS[0], state: StockState): number => {
    // Componente aleatório simples para começar
    const randomChange = (Math.random() - 0.5) * stock.volatility;
    const newPrice = state.currentPrice * (1 + randomChange);
    
    // Limita variação
    const maxChange = stock.basePrice * 0.01; // 1% máximo
    const priceDiff = newPrice - state.currentPrice;
    const limitedDiff = Math.max(-maxChange, Math.min(maxChange, priceDiff));
    
    const finalPrice = state.currentPrice + limitedDiff;
    
    // Garante que não fique muito longe do preço base
    const maxDeviation = stock.basePrice * 0.15; // 15% de desvio máximo
    const boundedPrice = Math.max(
      stock.basePrice - maxDeviation,
      Math.min(stock.basePrice + maxDeviation, finalPrice)
    );
    
    return Math.round(boundedPrice * 100) / 100;
  };

  // Atualiza uma ação específica
  const updateSingleStock = useCallback((stock: typeof BRAZILIAN_STOCKS[0]) => {
    const state = stockStatesRef.current.get(stock.symbol);
    if (!state) {
      console.error(`❌ Estado não encontrado para ${stock.symbol}`);
      return;
    }
    
    const oldPrice = state.currentPrice;
    const newPrice = generatePriceMovement(stock, state);
    
    // Atualiza estado interno
    state.currentPrice = newPrice;
    state.lastUpdate = Date.now();
    
    // Envia atualização para o store
    const quote = { [stock.symbol]: newPrice };
    console.log(`📈 Enviando quote:`, quote);
    updateStock(quote);
    
    const change = ((newPrice - oldPrice) / oldPrice * 100);
    console.log(`💰 ${stock.symbol}: R$ ${oldPrice.toFixed(2)} → R$ ${newPrice.toFixed(2)} (${change > 0 ? '+' : ''}${change.toFixed(2)}%)`);
    
  }, [updateStock]);

  // Atualiza todas as ações
  const updateAllStocks = useCallback(() => {
    if (!isMountedRef.current) {
      console.log('⚠️ Componente desmontado, parando atualizações');
      return;
    }
    
    try {
      console.log('🔄 Iniciando ciclo de atualização...');
      setConnectionStatus(true);
      
      // Atualiza cada ação
      BRAZILIAN_STOCKS.forEach((stock, index) => {
        setTimeout(() => {
          if (isMountedRef.current) {
            updateSingleStock(stock);
          }
        }, index * 100); // 100ms de delay entre cada ação
      });
      
      console.log('✅ Ciclo de atualização concluído');
      
    } catch (error) {
      console.error('❌ Erro na simulação:', error);
      setConnectionStatus(false, 'Erro interno na simulação');
    }
  }, [updateSingleStock, setConnectionStatus]);

  // Inicia a simulação
  const startSimulation = useCallback(() => {
    console.log('🎬 Iniciando simulação de ações...');
    
    // Limpa qualquer intervalo anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    initializeStockStates();
    
    // Primeira atualização após 1 segundo
    console.log('⏰ Primeira atualização em 1 segundo...');
    setTimeout(() => {
      if (isMountedRef.current) {
        console.log('🚀 Executando primeira atualização...');
        updateAllStocks();
      }
    }, 1000);
    
    // Configura intervalo
    intervalRef.current = setInterval(() => {
      console.log('⏰ Executando atualização periódica...');
      updateAllStocks();
    }, UPDATE_INTERVAL);
    
    console.log(`✅ Simulação configurada com intervalo de ${UPDATE_INTERVAL}ms`);
  }, [initializeStockStates, updateAllStocks]);

  // Para a simulação
  const stopSimulation = useCallback(() => {
    console.log('🛑 Parando simulação...');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isMountedRef.current = false;
    setConnectionStatus(false);
  }, [setConnectionStatus]);

  useEffect(() => {
    console.log('🔧 Hook useStockSimulator montado');
    isMountedRef.current = true;
    
    // Pequeno delay para garantir que tudo está carregado
    const initTimer = setTimeout(() => {
      startSimulation();
    }, 100);
    
    return () => {
      console.log('🧹 Limpando hook useStockSimulator');
      clearTimeout(initTimer);
      stopSimulation();
    };
  }, [startSimulation, stopSimulation]);

  return {
    isConnected: useStocksStore(state => state.isConnected),
    connectionError: useStocksStore(state => state.connectionError),
  };
};