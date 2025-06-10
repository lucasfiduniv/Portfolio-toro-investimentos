import { useStocksStore } from '@/store/stocks-store';

// Mock do Zustand para testes
jest.mock('zustand', () => ({
  create: (fn: any) => {
    const store = fn(() => ({}), () => ({}));
    return () => store;
  },
}));

describe('StocksStore', () => {
  beforeEach(() => {
    // Reset do store antes de cada teste
    const store = useStocksStore.getState();
    store.stocks = {};
    store.sortOrder = 'up';
  });

  it('should initialize with empty stocks', () => {
    const store = useStocksStore.getState();
    expect(Object.keys(store.stocks)).toHaveLength(0);
    expect(store.sortOrder).toBe('up');
  });

  it('should add new stock correctly', () => {
    const store = useStocksStore.getState();
    
    store.updateStock({ 'TEST4': 100.00 });
    
    const stock = store.stocks['TEST4'];
    expect(stock).toBeDefined();
    expect(stock.symbol).toBe('TEST4');
    expect(stock.price).toBe(100.00);
    expect(stock.openPrice).toBe(100.00);
    expect(stock.variation).toBe(0);
    expect(stock.variationPercent).toBe(0);
  });

  it('should calculate variation correctly', () => {
    const store = useStocksStore.getState();
    
    // Primeira cotação (abertura)
    store.updateStock({ 'TEST4': 100.00 });
    
    // Segunda cotação (alta de 5%)
    store.updateStock({ 'TEST4': 105.00 });
    
    const stock = store.stocks['TEST4'];
    expect(stock.variation).toBe(5.00);
    expect(stock.variationPercent).toBe(5);
    expect(stock.trend).toBe('up');
  });

  it('should return top gainers correctly', () => {
    const store = useStocksStore.getState();
    
    // Adiciona ações com diferentes variações
    store.updateStock({ 'STOCK1': 100.00 });
    store.updateStock({ 'STOCK1': 110.00 }); // +10%
    
    store.updateStock({ 'STOCK2': 50.00 });
    store.updateStock({ 'STOCK2': 52.50 }); // +5%
    
    store.updateStock({ 'STOCK3': 75.00 });
    store.updateStock({ 'STOCK3': 67.50 }); // -10%
    
    const topGainers = store.getTopGainers();
    
    expect(topGainers).toHaveLength(2);
    expect(topGainers[0].symbol).toBe('STOCK1');
    expect(topGainers[1].symbol).toBe('STOCK2');
  });

  it('should return top losers correctly', () => {
    const store = useStocksStore.getState();
    
    // Adiciona ações com diferentes variações
    store.updateStock({ 'STOCK1': 100.00 });
    store.updateStock({ 'STOCK1': 85.00 }); // -15%
    
    store.updateStock({ 'STOCK2': 50.00 });
    store.updateStock({ 'STOCK2': 47.50 }); // -5%
    
    store.updateStock({ 'STOCK3': 75.00 });
    store.updateStock({ 'STOCK3': 82.50 }); // +10%
    
    const topLosers = store.getTopLosers();
    
    expect(topLosers).toHaveLength(2);
    expect(topLosers[0].symbol).toBe('STOCK1');
    expect(topLosers[1].symbol).toBe('STOCK2');
  });

  it('should maintain price history with limit', () => {
    const store = useStocksStore.getState();
    
    // Adiciona primeira cotação
    store.updateStock({ 'TEST4': 100.00 });
    
    // Adiciona 25 cotações (acima do limite de 20)
    for (let i = 1; i <= 25; i++) {
      store.updateStock({ 'TEST4': 100.00 + i });
    }
    
    const stock = store.stocks['TEST4'];
    expect(stock.priceHistory).toHaveLength(20);
    expect(stock.priceHistory[0]).toBe(107.00); // Primeiro preço após remoção
    expect(stock.priceHistory[19]).toBe(125.00); // Último preço
  });
});