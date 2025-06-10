# Dashboard de Ações em Tempo Real - Toro

Dashboard web desenvolvido em Next.js que simula cotações de ações brasileiras em tempo real com dados realísticos. O projeto faz parte do desafio técnico da Toro Investimentos.

## ✨ Funcionalidades

- 📊 **Cotações Simuladas Realísticas**: Sistema avançado de simulação baseado em dados históricos reais
- 📈 **Ranking Dinâmico**: Top 5 ações em alta e baixa com base na variação percentual
- 📉 **Mini-gráficos**: Histórico visual dos últimos preços de cada ação
- 🎨 **Interface Responsiva**: Design fiel ao protótipo Figma, otimizado para desktop e mobile
- ⚡ **Performance Otimizada**: Renderização suave sem "piscadas" nos cards
- 🎯 **Feedback Visual**: Flash de cores para indicar mudanças de preço
- 🕐 **Horário de Mercado**: Simulação ativa apenas em horário comercial (10h-17h, seg-sex)
- 🎲 **Eventos Especiais**: Simulação de notícias e eventos que impactam os preços

## 🚀 Tecnologias Utilizadas

- **Next.js 13** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização e responsividade
- **Zustand** - Gerenciamento de estado
- **Simulador Avançado** - Sistema próprio de simulação realística
- **Jest + Testing Library** - Testes automatizados

## 🏗️ Arquitetura

### Gerenciamento de Estado
- **Zustand Store** (`store/stocks-store.ts`): Estado centralizado das ações
- **Seletores Memoizados**: Otimização para cálculos de ranking
- **Estado Reativo**: Atualizações automáticas da UI

### Sistema de Simulação
- **Preços Base Realísticos**: Baseados em cotações históricas reais
- **Volatilidade Específica**: Cada ação tem sua própria volatilidade
- **Tendências de Mercado**: Simulação de movimentos macro
- **Reversão à Média**: Preços tendem a voltar ao valor base
- **Eventos Especiais**: Impactos aleatórios simulando notícias

### Lógica de Negócio
- **Cálculo de Variação**: Baseado no primeiro preço recebido (abertura)
- **Ranking em Tempo Real**: Top 5 altas/baixas recalculado a cada cotação
- **Histórico de Preços**: Mantém últimas 20 cotações para mini-gráficos

### Componentes
- **StockCard**: Card individual de cada ação com animações
- **MiniChart**: Gráfico SVG otimizado para histórico de preços
- **ConnectionStatus**: Indicador de status do simulador

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd toro-stocks-dashboard
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute a aplicação
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🧪 Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Cobertura de Testes
- ✅ Lógica de cálculo de variação percentual
- ✅ Ranqueamento de ações (top gainers/losers)
- ✅ Gerenciamento de histórico de preços
- ✅ Renderização de componentes UI
- ✅ Formatação e exibição de dados

## 📱 Design e UX

### Responsividade
- **Desktop**: Grid de até 5 colunas
- **Tablet**: Grid de 2-3 colunas  
- **Mobile**: Coluna única

### Animações e Feedback
- **Flash Verde/Vermelho**: Indica alta/baixa no preço
- **Transições Suaves**: Hover states e mudanças de estado
- **Loading States**: Indicadores durante carregamento

### Paleta de Cores
- **Azul Toro** (`#0891B2`): Cor primária e gráficos
- **Verde** (`#10B981`): Variações positivas
- **Vermelho** (`#EF4444`): Variações negativas
- **Cinza** (`#64748B`): Textos secundários

## 🎯 Sistema de Simulação

### Ações Monitoradas
O dashboard simula as principais ações brasileiras:
- **PETR4** (Petrobras) - R$ 38,50 base
- **VALE3** (Vale) - R$ 65,20 base
- **ITUB4** (Itaú Unibanco) - R$ 25,80 base
- **BBDC4** (Bradesco) - R$ 12,45 base
- **ABEV3** (Ambev) - R$ 14,30 base
- **MGLU3** (Magazine Luiza) - R$ 8,75 base
- **WEGE3** (WEG) - R$ 45,60 base
- **RENT3** (Localiza) - R$ 55,90 base
- **LREN3** (Lojas Renner) - R$ 18,25 base
- **GGBR4** (Gerdau) - R$ 22,10 base

### Algoritmo de Simulação
O sistema utiliza múltiplos fatores para gerar movimentos realísticos:

1. **Tendência de Mercado**: Movimento senoidal que afeta todas as ações
2. **Reversão à Média**: Força que puxa os preços de volta ao valor base
3. **Momentum**: Continuidade da direção atual do movimento
4. **Volatilidade Específica**: Cada ação tem sua própria volatilidade
5. **Eventos Especiais**: Impactos aleatórios (0,1% de chance por update)
6. **Horário de Mercado**: Maior volatilidade na abertura e fechamento

### Controles de Segurança
- **Circuit Breaker**: Limita variação máxima por update (1%)
- **Desvio Máximo**: Preços não podem se afastar mais de 15% do valor base
- **Horário Comercial**: Simulação ativa apenas das 10h às 17h (seg-sex)

## 📊 Lógica de Cálculo

### Variação Percentual
```typescript
const variation = newPrice - openPrice;
const variationPercent = (variation / openPrice) * 100;
```

### Ranking
- **Top Gainers**: Ações com maior variação percentual positiva
- **Top Losers**: Ações com maior variação percentual negativa (mais negativa primeiro)

### Movimento de Preço
```typescript
const totalMovement = (
  marketTrend + 
  meanReversion + 
  momentum + 
  randomComponent
) * timeMultiplier;
```

## 🎯 Diferenciais Implementados

1. **Simulação Realística**: Algoritmo avançado baseado em fatores reais de mercado
2. **Horário de Mercado**: Respeita horário comercial brasileiro
3. **Volatilidade Específica**: Cada ação tem comportamento único
4. **Eventos Especiais**: Simulação de impactos de notícias
5. **Performance Otimizada**: Cards não "piscam" durante atualizações
6. **Mini-gráficos SVG**: Renderização eficiente sem bibliotecas externas
7. **Estado Centralizado**: Zustand para gerenciamento reativo
8. **Testes Abrangentes**: Cobertura da lógica crítica de negócio
9. **Design System**: Implementação fiel ao protótipo Figma

## 🚦 Status do Projeto

✅ **Concluído**
- Sistema de simulação realística funcionando
- Cálculo de variações correto  
- Interface responsiva
- Testes implementados
- Performance otimizada
- Horário de mercado implementado

## 📝 Notas Técnicas

### Parâmetros de Simulação
- **Intervalo de Atualização**: 2 segundos
- **Volatilidade**: 1,2% a 3,5% dependendo da ação
- **Desvio Máximo**: 15% do preço base
- **Circuit Breaker**: 1% por atualização
- **Horário**: 10h às 17h, segunda a sexta

### Algoritmo de Preços
O sistema combina:
- Tendências macro de mercado (ciclos de 5 minutos)
- Reversão à média para estabilidade
- Momentum para continuidade
- Componente aleatório para realismo
- Multiplicadores por horário

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico para a Toro Investimentos.