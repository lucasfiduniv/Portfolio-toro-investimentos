import { render, screen } from '@testing-library/react';
import { StockCard } from '@/components/stock-card';
import { Stock } from '@/types/stock';

const mockStock: Stock = {
  symbol: 'TEST4',
  price: 100.50,
  openPrice: 95.00,
  variation: 5.50,
  variationPercent: 5.79,
  priceHistory: [95.00, 97.50, 100.50],
  lastUpdated: Date.now(),
  trend: 'up',
};

describe('StockCard', () => {
  it('renders stock information correctly', () => {
    render(<StockCard stock={mockStock} />);
    
    expect(screen.getByText('TEST4')).toBeInTheDocument();
    expect(screen.getByText('R$ 100,50 ↑')).toBeInTheDocument();
    expect(screen.getByText('PREÇO DO ATIVO')).toBeInTheDocument();
    expect(screen.getByText('AES Eletropaulo')).toBeInTheDocument();
  });

  it('shows down arrow for negative variation', () => {
    const negativeStock = { ...mockStock, variationPercent: -2.5, trend: 'down' as const };
    render(<StockCard stock={negativeStock} />);
    
    expect(screen.getByText('R$ 100,50 ↓')).toBeInTheDocument();
  });

  it('displays stock initials in avatar', () => {
    render(<StockCard stock={mockStock} />);
    
    expect(screen.getByText('TE')).toBeInTheDocument();
  });
});