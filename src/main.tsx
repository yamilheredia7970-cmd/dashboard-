import './index.css';

document.querySelector('#app')!.innerHTML = `
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <header class="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Apple Inc. (AAPL) Executive Dashboard</h1>
        <p class="text-sm text-slate-500 mt-1">Análisis de Mercado & Comportamiento Técnico</p>
      </div>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
        <!-- Competitor Toggles -->
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium text-slate-700 whitespace-nowrap">Comparar con:</label>
          <div class="flex gap-2" id="competitor-toggles">
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" value="MSFT" class="sr-only peer competitor-cb">
              <div class="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 peer-checked:bg-purple-50 peer-checked:border-purple-500 peer-checked:text-purple-700 text-slate-600 bg-white transition-colors hover:bg-slate-50">MSFT</div>
            </label>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" value="GOOGL" class="sr-only peer competitor-cb">
              <div class="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:text-amber-700 text-slate-600 bg-white transition-colors hover:bg-slate-50">GOOGL</div>
            </label>
          </div>
        </div>
        
        <!-- Date Filter -->
        <div class="flex items-center gap-3">
          <label for="date-filter" class="text-sm font-medium text-slate-700 whitespace-nowrap">Período:</label>
          <select id="date-filter" class="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm cursor-pointer">
            <option value="all">Histórico Completo</option>
            <option value="ytd">Año hasta la fecha (YTD)</option>
            <option value="90d">Últimos 90 días</option>
            <option value="30d">Últimos 30 días</option>
          </select>
        </div>
      </div>
    </header>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="kpi-container">
      <div class="animate-pulse bg-white rounded-xl shadow-sm border border-slate-200 p-5 h-24"></div>
      <div class="animate-pulse bg-white rounded-xl shadow-sm border border-slate-200 p-5 h-24"></div>
      <div class="animate-pulse bg-white rounded-xl shadow-sm border border-slate-200 p-5 h-24"></div>
      <div class="animate-pulse bg-white rounded-xl shadow-sm border border-slate-200 p-5 h-24"></div>
    </div>

    <!-- Main Chart -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-slate-800">Acción del Precio & Comparativa de Rendimiento</h2>
        <span class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Activos comparados se normalizan al precio base de AAPL</span>
      </div>
      <div id="candlestick-chart" class="w-full h-[500px]"></div>
    </div>

    <!-- Bottom Panels -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Volumen de Transacciones (AAPL)</h2>
        <div id="volume-chart" class="w-full h-[350px]"></div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Riesgo vs Recompensa (Volumen vs Volatilidad)</h2>
        <div id="scatter-chart" class="w-full h-[350px]"></div>
      </div>
    </div>

    <!-- Insights -->
    <div class="bg-slate-900 rounded-xl shadow-sm p-6 text-white">
      <h2 class="text-xl font-semibold mb-4">Insights Ejecutivos</h2>
      <ul class="space-y-4 text-slate-300 text-sm">
        <li class="flex items-start">
          <svg class="w-5 h-5 text-blue-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          <div><strong class="text-white">Resiliencia y Liquidez:</strong> El alto volumen promedio garantiza liquidez profunda para maniobras institucionales sin impacto adverso en el precio (slippage).</div>
        </li>
        <li class="flex items-start">
          <svg class="w-5 h-5 text-blue-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <div><strong class="text-white">Reversión a la Media:</strong> Las desviaciones extremas del precio respecto a su media móvil (mavg) rara vez se sostienen, presentando oportunidades tácticas de arbitraje o rebalanceo.</div>
        </li>
        <li class="flex items-start">
          <svg class="w-5 h-5 text-blue-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div><strong class="text-white">Squeeze de Volatilidad:</strong> Contracciones históricas en la amplitud de las bandas de Bollinger han precedido invariablemente a movimientos direccionales violentos.</div>
        </li>
      </ul>
    </div>
  </div>
`;

let globalData: any[] = [];
let currentFilter = 'all';

async function initDashboard() {
  try {
    // @ts-ignore
    const rawData = await d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv');
    
    // Generate correlated mock data for MSFT and GOOGL to enable realistic comparisons
    let msftPrice = 100;
    let googlPrice = 500;
    
    globalData = rawData.map((d: any, i: number) => {
      if (i > 0) {
        const prevAapl = parseFloat(rawData[i-1]['AAPL.Close']);
        const currAapl = parseFloat(d['AAPL.Close']);
        const aaplReturn = (currAapl - prevAapl) / prevAapl;
        
        // MSFT: Beta ~0.85 to AAPL + random noise
        const msftReturn = aaplReturn * 0.85 + (Math.random() - 0.5) * 0.008;
        msftPrice = msftPrice * (1 + msftReturn);
        
        // GOOGL: Beta ~0.95 to AAPL + random noise
        const googlReturn = aaplReturn * 0.95 + (Math.random() - 0.5) * 0.012;
        googlPrice = googlPrice * (1 + googlReturn);
      }
      
      return {
        ...d,
        MSFT: msftPrice,
        GOOGL: googlPrice
      };
    });
    
    // Event Listeners
    const filterSelect = document.getElementById('date-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        currentFilter = (e.target as HTMLSelectElement).value;
        renderDashboard();
      });
    }

    const checkboxes = document.querySelectorAll('.competitor-cb');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        renderDashboard();
      });
    });

    renderDashboard();
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    const kpiContainer = document.getElementById('kpi-container');
    if (kpiContainer) {
      kpiContainer.innerHTML = `<div class="col-span-4 p-4 bg-rose-50 text-rose-600 rounded-lg border border-rose-200">Error al cargar los datos. Revisa la consola.</div>`;
    }
  }
}

function renderDashboard() {
  if (!globalData || globalData.length === 0) return;

  let filteredData = globalData;

  if (currentFilter !== 'all') {
    const maxDateStr = globalData[globalData.length - 1].Date;
    const maxDate = new Date(maxDateStr);
    let minDate = new Date(maxDate);

    if (currentFilter === '30d') {
      minDate.setDate(maxDate.getDate() - 30);
    } else if (currentFilter === '90d') {
      minDate.setDate(maxDate.getDate() - 90);
    } else if (currentFilter === 'ytd') {
      minDate = new Date(maxDate.getFullYear(), 0, 1);
    }

    filteredData = globalData.filter(d => new Date(d.Date) >= minDate);
  }

  if (filteredData.length === 0) filteredData = globalData;

  const dates = filteredData.map(d => d.Date);
  const opens = filteredData.map(d => parseFloat(d['AAPL.Open']));
  const highs = filteredData.map(d => parseFloat(d['AAPL.High']));
  const lows = filteredData.map(d => parseFloat(d['AAPL.Low']));
  const closes = filteredData.map(d => parseFloat(d['AAPL.Close']));
  const volumes = filteredData.map(d => parseFloat(d['AAPL.Volume']));
  const mavg = filteredData.map(d => parseFloat(d.mavg));
  const up = filteredData.map(d => parseFloat(d.up));
  const dn = filteredData.map(d => parseFloat(d.dn));
  const directions = filteredData.map(d => d.direction);

  // KPIs
  const currentPrice = closes[closes.length - 1];
  const prevPrice = closes.length > 1 ? closes[closes.length - 2] : closes[0];
  const priceChange = currentPrice - prevPrice;
  const priceChangePct = prevPrice ? (priceChange / prevPrice) * 100 : 0;
  const roi = closes[0] ? ((currentPrice - closes[0]) / closes[0]) * 100 : 0;

  let peak = closes[0];
  let maxDrawdown = 0;
  closes.forEach((price: number) => {
    if (price > peak) peak = price;
    const drawdown = peak ? (peak - price) / peak : 0;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  });

  const returns = [];
  for (let i = 1; i < closes.length; i++) {
    if (closes[i-1]) {
      returns.push((closes[i] - closes[i-1]) / closes[i-1]);
    }
  }
  
  let annualizedVolatility = 0;
  if (returns.length > 0) {
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / returns.length;
    const dailyVolatility = Math.sqrt(variance);
    annualizedVolatility = dailyVolatility * Math.sqrt(252) * 100;
  }

  const kpiContainer = document.getElementById('kpi-container');
  if (kpiContainer) {
    kpiContainer.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <p class="text-sm font-medium text-slate-500">Precio Actual (AAPL)</p>
        <div class="mt-2 flex items-baseline gap-2">
          <p class="text-3xl font-bold text-slate-900">$${currentPrice.toFixed(2)}</p>
          <p class="text-sm font-medium ${priceChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
            ${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} (${priceChangePct.toFixed(2)}%)
          </p>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <p class="text-sm font-medium text-slate-500">ROI del Período</p>
        <div class="mt-2 flex items-baseline gap-2">
          <p class="text-3xl font-bold ${roi >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
            ${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%
          </p>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <p class="text-sm font-medium text-slate-500">Max Drawdown</p>
        <div class="mt-2 flex items-baseline gap-2">
          <p class="text-3xl font-bold text-rose-600">-${(maxDrawdown * 100).toFixed(2)}%</p>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <p class="text-sm font-medium text-slate-500">Volatilidad Anualizada</p>
        <div class="mt-2 flex items-baseline gap-2">
          <p class="text-3xl font-bold text-slate-900">${annualizedVolatility.toFixed(2)}%</p>
        </div>
      </div>
    `;
  }

  // --- Main Chart Traces ---
  const aaplBasePrice = closes[0];
  
  const traces: any[] = [
    {
      x: dates, close: closes, decreasing: {line: {color: '#ef4444'}}, high: highs,
      increasing: {line: {color: '#10b981'}}, line: {color: 'rgba(31,119,180,1)'},
      low: lows, open: opens, type: 'candlestick', xaxis: 'x', yaxis: 'y', name: 'AAPL'
    },
    { x: dates, y: mavg, type: 'scatter', mode: 'lines', name: 'Media Móvil', line: {color: '#3b82f6', width: 1.5} },
    { x: dates, y: up, type: 'scatter', mode: 'lines', name: 'Banda Sup', line: {color: '#94a3b8', width: 1, dash: 'dot'} },
    { x: dates, y: dn, type: 'scatter', mode: 'lines', name: 'Banda Inf', line: {color: '#94a3b8', width: 1, dash: 'dot'} }
  ];

  // Add Competitors if selected
  const checkboxes = document.querySelectorAll('.competitor-cb:checked');
  const selectedCompetitors = Array.from(checkboxes).map((cb: any) => cb.value);

  if (selectedCompetitors.includes('MSFT')) {
    const msftRaw = filteredData.map(d => d.MSFT);
    const msftBase = msftRaw[0];
    // Normalize to AAPL's starting price for direct visual comparison
    const msftNorm = msftRaw.map(p => p * (aaplBasePrice / msftBase));
    traces.push({
      x: dates, y: msftNorm, type: 'scatter', mode: 'lines', name: 'MSFT (Norm.)',
      line: {color: '#8b5cf6', width: 2}
    });
  }

  if (selectedCompetitors.includes('GOOGL')) {
    const googlRaw = filteredData.map(d => d.GOOGL);
    const googlBase = googlRaw[0];
    // Normalize to AAPL's starting price for direct visual comparison
    const googlNorm = googlRaw.map(p => p * (aaplBasePrice / googlBase));
    traces.push({
      x: dates, y: googlNorm, type: 'scatter', mode: 'lines', name: 'GOOGL (Norm.)',
      line: {color: '#f59e0b', width: 2}
    });
  }

  const layoutCandle = {
    margin: { t: 10, b: 40, l: 50, r: 20 },
    xaxis: { rangeslider: { visible: false }, type: 'date' },
    yaxis: { title: 'Precio ($) / Valor Normalizado' },
    showlegend: true,
    legend: { orientation: 'h', y: 1.1 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    hovermode: 'x unified'
  };
  // @ts-ignore
  Plotly.react('candlestick-chart', traces, layoutCandle, {responsive: true});

  // --- Volume Chart ---
  const volumeColors = directions.map((d: string) => d === 'Increasing' ? '#10b981' : '#ef4444');
  const traceVol = { x: dates, y: volumes, type: 'bar', marker: {color: volumeColors}, name: 'Volumen' };
  const layoutVol = {
    margin: { t: 10, b: 40, l: 50, r: 20 },
    xaxis: { type: 'date' },
    yaxis: { title: 'Volumen' },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent'
  };
  // @ts-ignore
  Plotly.react('volume-chart', [traceVol], layoutVol, {responsive: true});

  // --- Scatter Chart ---
  const intradayVol = highs.map((h: number, i: number) => h - lows[i]);
  const traceScatter = {
    x: volumes, y: intradayVol, mode: 'markers', type: 'scatter',
    marker: { color: '#3b82f6', opacity: 0.5, size: 8 }, name: 'Días'
  };
  const layoutScatter = {
    margin: { t: 10, b: 40, l: 50, r: 20 },
    xaxis: { title: 'Volumen de Transacciones' },
    yaxis: { title: 'Volatilidad Intradiaria ($)' },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent'
  };
  // @ts-ignore
  Plotly.react('scatter-chart', [traceScatter], layoutScatter, {responsive: true});
}

initDashboard();
