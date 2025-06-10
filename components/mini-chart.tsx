'use client';

interface MiniChartProps {
  data: number[];
}

export function MiniChart({ data }: MiniChartProps) {
  if (data.length < 2) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
        <div className="text-xs text-gray-400">Carregando...</div>
      </div>
    );
  }

  const width = 280;
  const height = 64;
  const padding = 4;

  const minPrice = Math.min(...data);
  const maxPrice = Math.max(...data);
  const priceRange = maxPrice - minPrice || 1;

  // Gera pontos do gráfico
  const points = data.map((price, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  // Cria área preenchida para gradiente
  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className="w-full h-full relative">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0891B2" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0891B2" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Área preenchida */}
        <polygon
          points={areaPoints}
          fill="url(#chartGradient)"
        />
        
        {/* Linha do gráfico */}
        <polyline
          points={points}
          fill="none"
          stroke="#0891B2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}