import './index.css';

console.log("Dashboard script loaded");

let globalData = [];
let currentFilter = 'all';

async function initDashboard() {
  try {
    console.log("Fetching data...");
    // Use window.d3 to avoid strict mode implicit global issues
    const rawData = await window.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv');
    console.log("Data fetched successfully", rawData.length, "rows");
    
    // Generate correlated mock data for MSFT and GOOGL to enable realistic comparisons
    let msftPrice = 100;
    let googlPrice = 500;
    
    globalData = rawData.map((d, i) => {
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
        currentFilter = e.target.value;
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
  try {
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
    const currentPrice = closes[closes.length - 1] || 0;
    const prevPrice = closes.length > 1 ? closes[closes.length - 2] : closes[0] || 0;
    const priceChange = currentPrice - prevPrice;
    const priceChangePct = prevPrice ? (priceChange / prevPrice) * 100 : 0;
    const roi = closes[0] ? ((currentPrice - closes[0]) / closes[0]) * 100 : 0;

    let peak = closes[0] || 0;
    let maxDrawdown = 0;
    closes.forEach((price) => {
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
    const aaplBasePrice = closes[0] || 1;
    
    const traces = [
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
    const selectedCompetitors = Array.from(checkboxes).map(cb => cb.value);

    if (selectedCompetitors.includes('MSFT')) {
      const msftRaw = filteredData.map(d => d.MSFT);
      const msftBase = msftRaw[0] || 1;
      const msftNorm = msftRaw.map(p => p * (aaplBasePrice / msftBase));
      traces.push({
        x: dates, y: msftNorm, type: 'scatter', mode: 'lines', name: 'MSFT (Norm.)',
        line: {color: '#8b5cf6', width: 2}
      });
    }

    if (selectedCompetitors.includes('GOOGL')) {
      const googlRaw = filteredData.map(d => d.GOOGL);
      const googlBase = googlRaw[0] || 1;
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
    window.Plotly.react('candlestick-chart', traces, layoutCandle, {responsive: true});

    // --- Volume Chart ---
    const volumeColors = directions.map(d => d === 'Increasing' ? '#10b981' : '#ef4444');
    const traceVol = { x: dates, y: volumes, type: 'bar', marker: {color: volumeColors}, name: 'Volumen' };
    const layoutVol = {
      margin: { t: 10, b: 40, l: 50, r: 20 },
      xaxis: { type: 'date' },
      yaxis: { title: 'Volumen' },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent'
    };
    window.Plotly.react('volume-chart', [traceVol], layoutVol, {responsive: true});

    // --- Scatter Chart ---
    const intradayVol = highs.map((h, i) => h - lows[i]);
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
    window.Plotly.react('scatter-chart', [traceScatter], layoutScatter, {responsive: true});
  } catch (err) {
    console.error("Error rendering dashboard:", err);
  }
}

initDashboard();
