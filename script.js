if (typeof window.Chart === "undefined") {
  class SimpleChart {
    constructor(canvas, config) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.config = config;
      this.draw();
    }

    destroy() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = Math.max(600, rect.width * dpr);
      this.canvas.height = Math.max(320, rect.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const width = rect.width || 600;
      const height = rect.height || 320;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      for (let i = 1; i <= 4; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(width - 20, y);
        ctx.stroke();
      }

      const labels = this.config.data.labels || [];
      const datasets = this.config.data.datasets || [];
      if (!datasets.length) return;
      const values = datasets.flatMap(ds => ds.data || []);
      const min = Math.min(...values, 0);
      const max = Math.max(...values, 1);
      const pad = (max - min) * 0.15 || 1;
      const yMin = min - pad;
      const yMax = max + pad;
      const plotW = width - 70;
      const plotH = height - 70;
      const startX = 45;
      const startY = 20;
      const mapY = value => startY + plotH - ((value - yMin) / (yMax - yMin)) * plotH;

      ctx.font = "12px Segoe UI";
      ctx.fillStyle = "#bdbdbd";
      labels.slice(0, 6).forEach((label, idx) => {
        const x = startX + (plotW / Math.max(1, labels.length - 1)) * (idx * Math.max(1, Math.floor((labels.length - 1) / Math.max(1, Math.min(5, labels.length - 1)))));
        ctx.fillText(String(label).slice(5), x, height - 18);
      });

      if (this.config.type === "bar") {
        const ds = datasets[0];
        const barWidth = plotW / Math.max(1, ds.data.length) * 0.55;
        ds.data.forEach((value, index) => {
          const x = startX + (plotW / ds.data.length) * index + 16;
          const y = mapY(value);
          const h = startY + plotH - y;
          ctx.fillStyle = Array.isArray(ds.backgroundColor) ? ds.backgroundColor[index % ds.backgroundColor.length] : "rgba(212,175,55,0.85)";
          ctx.fillRect(x, y, barWidth, h);
          ctx.fillStyle = "#eaeaea";
          ctx.fillText(labels[index], x, height - 18);
        });
        return;
      }

      datasets.forEach((ds, di) => {
        ctx.strokeStyle = ds.borderColor || ["#d4af37", "#6ad2ff", "#7dffb2", "#ff9d4d"][di % 4];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ds.data.forEach((value, index) => {
          const x = startX + (plotW / Math.max(1, ds.data.length - 1)) * index;
          const y = mapY(value);
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });
    }
  }
  window.Chart = SimpleChart;
}

const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const result = document.getElementById("result");
const rateInfo = document.getElementById("rateInfo");
const coinBurstLayer = document.getElementById("coinBurstLayer");
const marketGrid = document.getElementById("marketGrid");

const APP_CONFIG = window.APP_CONFIG || {};
const ALPHA_VANTAGE_KEY = APP_CONFIG.ALPHA_VANTAGE_KEY || "";
const DEMO_MODE = new URLSearchParams(window.location.search).get("demo") === "1" || APP_CONFIG.DEMO_MODE === true;

const MARKET_CACHE_KEY = "polanski_market_cache_v2";
const MARKET_CACHE_TTL_MS = 15 * 60 * 1000;

let fxChartInstance = null;
let marketChartInstance = null;
let availableCurrencies = {};

const marketIndexes = [
  { name: "S&P 500", symbol: "SPY" },
  { name: "NASDAQ 100", symbol: "QQQ" },
  { name: "Dow Jones", symbol: "DIA" },
  { name: "Brasil", symbol: "EWZ" }
];

const currencyFlags = {
  BRL: "🇧🇷", USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", CAD: "🇨🇦", AUD: "🇦🇺", CHF: "🇨🇭",
  CNY: "🇨🇳", HKD: "🇭🇰", NZD: "🇳🇿", MXN: "🇲🇽", ARS: "🇦🇷", CLP: "🇨🇱", COP: "🇨🇴", ZAR: "🇿🇦",
  SEK: "🇸🇪", NOK: "🇳🇴", DKK: "🇩🇰", PLN: "🇵🇱", TRY: "🇹🇷", INR: "🇮🇳", KRW: "🇰🇷", SGD: "🇸🇬", THB: "🇹🇭"
};

const preferredOrder = ["BRL", "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "HKD", "NZD", "MXN", "ARS", "CLP", "COP", "INR", "KRW", "SGD"];


const demoCurrencies = {
  BRL: "Real Brasileiro",
  USD: "Dólar Americano",
  EUR: "Euro",
  GBP: "Libra Esterlina",
  JPY: "Iene Japonês",
  CAD: "Dólar Canadense"
};

function buildDemoFxSeries(from, to) {
  const labels = [];
  const values = [];
  const today = new Date();
  const baseValue = from === "BRL" && to === "USD" ? 0.1745 : from === "USD" && to === "BRL" ? 5.73 : 1.12;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    labels.push(date.toISOString().split("T")[0]);
    values.push(Number((baseValue + Math.sin(i / 4) * 0.01 + (29 - i) * 0.00025).toFixed(4)));
  }

  return { labels, values };
}

const demoMarketData = [
  { name: "S&P 500", symbol: "SPY", price: 514.82, change: 4.18, changePercent: "0.82%" },
  { name: "NASDAQ 100", symbol: "QQQ", price: 442.37, change: 5.94, changePercent: "1.36%" },
  { name: "Dow Jones", symbol: "DIA", price: 389.14, change: -1.22, changePercent: "-0.31%" },
  { name: "Brasil", symbol: "EWZ", price: 28.45, change: 0.37, changePercent: "1.32%" }
];

function getCurrencyLabel(code, name) {
  const flag = currencyFlags[code] ? `${currencyFlags[code]} ` : "";
  return `${flag}${code} - ${name}`;
}

function formatMoney(value, currencyCode) {
  const localeMap = { BRL: "pt-BR", USD: "en-US", EUR: "de-DE", GBP: "en-GB", JPY: "ja-JP", CAD: "en-CA", AUD: "en-AU", CHF: "de-CH" };
  try {
    return new Intl.NumberFormat(localeMap[currencyCode] || "en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2
    }).format(value);
  } catch {
    return `${Number(value).toFixed(2)} ${currencyCode}`;
  }
}

function getDateRange(days) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0]
  };
}

function saveMarketCache(data) {
  localStorage.setItem(MARKET_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
}

function getMarketCache() {
  try {
    const raw = localStorage.getItem(MARKET_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.data || !Array.isArray(parsed.data)) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function loadCurrencies() {
  if (DEMO_MODE) {
    availableCurrencies = demoCurrencies;
    const sortedCodes = Object.keys(demoCurrencies);
    fromCurrency.innerHTML = "";
    toCurrency.innerHTML = "";

    sortedCodes.forEach(code => {
      const fromOption = document.createElement("option");
      fromOption.value = code;
      fromOption.textContent = getCurrencyLabel(code, demoCurrencies[code]);

      const toOption = document.createElement("option");
      toOption.value = code;
      toOption.textContent = getCurrencyLabel(code, demoCurrencies[code]);

      fromCurrency.appendChild(fromOption);
      toCurrency.appendChild(toOption);
    });

    fromCurrency.value = "BRL";
    toCurrency.value = "USD";
    rateInfo.textContent = "Modo de demonstração ativo.";
    await loadFxHistory("BRL", "USD");
    return;
  }

  try {
    const response = await fetch("https://api.frankfurter.dev/v1/currencies");
    if (!response.ok) throw new Error("Falha ao carregar a lista de moedas.");

    const currencies = await response.json();
    availableCurrencies = currencies;

    const sortedCodes = [
      ...preferredOrder.filter(code => currencies[code]),
      ...Object.keys(currencies).filter(code => !preferredOrder.includes(code)).sort((a, b) => a.localeCompare(b))
    ];

    fromCurrency.innerHTML = "";
    toCurrency.innerHTML = "";

    sortedCodes.forEach(code => {
      const fromOption = document.createElement("option");
      fromOption.value = code;
      fromOption.textContent = getCurrencyLabel(code, currencies[code]);

      const toOption = document.createElement("option");
      toOption.value = code;
      toOption.textContent = getCurrencyLabel(code, currencies[code]);

      fromCurrency.appendChild(fromOption);
      toCurrency.appendChild(toOption);
    });

    fromCurrency.value = currencies.BRL ? "BRL" : sortedCodes[0];
    toCurrency.value = currencies.USD ? "USD" : sortedCodes[1] || sortedCodes[0];

    await loadFxHistory(fromCurrency.value, toCurrency.value);
  } catch (error) {
    console.error(error);
    rateInfo.textContent = "Não foi possível carregar a lista completa de moedas.";
    fromCurrency.innerHTML = `
      <option value="BRL">🇧🇷 BRL - Real Brasileiro</option>
      <option value="USD">🇺🇸 USD - Dólar Americano</option>
      <option value="EUR">🇪🇺 EUR - Euro</option>
      <option value="GBP">🇬🇧 GBP - Libra Esterlina</option>
      <option value="JPY">🇯🇵 JPY - Iene Japonês</option>
      <option value="CAD">🇨🇦 CAD - Dólar Canadense</option>
      <option value="AUD">🇦🇺 AUD - Dólar Australiano</option>
      <option value="CHF">🇨🇭 CHF - Franco Suíço</option>
    `;

    toCurrency.innerHTML = `
      <option value="USD">🇺🇸 USD - Dólar Americano</option>
      <option value="BRL">🇧🇷 BRL - Real Brasileiro</option>
      <option value="EUR">🇪🇺 EUR - Euro</option>
      <option value="GBP">🇬🇧 GBP - Libra Esterlina</option>
      <option value="JPY">🇯🇵 JPY - Iene Japonês</option>
      <option value="CAD">🇨🇦 CAD - Dólar Canadense</option>
      <option value="AUD">🇦🇺 AUD - Dólar Australiano</option>
      <option value="CHF">🇨🇭 CHF - Franco Suíço</option>
    `;

    fromCurrency.value = "BRL";
    toCurrency.value = "USD";
    await loadFxHistory(fromCurrency.value, toCurrency.value);
  }
}

async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    result.textContent = "Digite um valor válido.";
    result.className = "result-main error";
    rateInfo.textContent = "O valor precisa ser maior que zero.";
    return;
  }

  if (!from || !to) {
    result.textContent = "Selecione as moedas.";
    result.className = "result-main error";
    rateInfo.textContent = "Escolha uma moeda de origem e uma de destino.";
    return;
  }

  if (from === to) {
    result.textContent = `${formatMoney(amount, from)} = ${formatMoney(amount, to)}`;
    result.className = "result-main success";
    rateInfo.textContent = "As moedas são iguais, então o valor permanece o mesmo.";
    await loadFxHistory(from, to);
    return;
  }

  result.textContent = "Convertendo...";

  if (DEMO_MODE) {
    const rateMap = { "BRL_USD": 0.1745, "USD_BRL": 5.73, "EUR_BRL": 6.22, "BRL_EUR": 0.1608, "USD_EUR": 0.92, "EUR_USD": 1.09 };
    const key = `${from}_${to}`;
    const rate = rateMap[key] || 1.12;
    const converted = amount * rate;
    result.textContent = `${formatMoney(amount, from)} = ${formatMoney(converted, to)}`;
    result.className = "result-main success";
    rateInfo.textContent = `1 ${from} = ${rate.toFixed(6)} ${to} • Demonstração local`;
    await loadFxHistory(from, to);
    return;
  }
  result.className = "result-main";
  rateInfo.textContent = "Buscando cotação em tempo real...";

  try {
    const url = `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Falha ao consultar a API de câmbio.");

    const data = await response.json();
    const rate = data.rates[to];
    const converted = amount * rate;

    result.textContent = `${formatMoney(amount, from)} = ${formatMoney(converted, to)}`;
    result.className = "result-main success";
    rateInfo.textContent = `1 ${from} = ${rate.toFixed(6)} ${to} • Data da cotação: ${data.date}`;

    await loadFxHistory(from, to);
  } catch (error) {
    result.textContent = "Erro ao converter.";
    result.className = "result-main error";
    rateInfo.textContent = "Não foi possível buscar a cotação online agora.";
    console.error(error);
  }
}

async function loadFxHistory(from, to) {
  if (!from || !to) return;

  if (DEMO_MODE) {
    const { labels, values } = buildDemoFxSeries(from, to);
    renderFxChart(labels, values, `${from}/${to}`);
    return;
  }

  const { start, end } = getDateRange(30);

  try {
    const url = `https://api.frankfurter.dev/v1/${start}..${end}?base=${from}&symbols=${to}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao buscar histórico cambial.");

    const data = await response.json();
    const rates = data.rates || {};
    const labels = Object.keys(rates).sort();
    const values = labels.map(date => rates[date][to]);
    renderFxChart(labels, values, `${from}/${to}`);
  } catch (error) {
    console.error(error);
  }
}

function renderFxChart(labels, values, pairLabel) {
  const ctx = document.getElementById("fxChart");
  if (fxChartInstance) fxChartInstance.destroy();

  fxChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `Histórico ${pairLabel}`,
        data: values,
        borderColor: "#d4af37",
        backgroundColor: "rgba(212, 175, 55, 0.16)",
        borderWidth: 2,
        tension: 0.25,
        fill: true,
        pointRadius: 2
      }]
    },
    options: getDarkChartOptions()
  });
}

function getDarkChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#f1f1f1" } }
    },
    scales: {
      x: { ticks: { color: "#bbbbbb" }, grid: { color: "rgba(255,255,255,0.06)" } },
      y: { ticks: { color: "#bbbbbb" }, grid: { color: "rgba(255,255,255,0.06)" } }
    }
  };
}

function buildMarketCard(item) {
  const positive = item.change >= 0;
  return `
    <div class="market-card">
      <div class="market-name">${item.name}</div>
      <div class="market-symbol">${item.symbol}</div>
      <div class="market-price">${item.price.toFixed(2)}</div>
      <div class="market-change ${positive ? "market-positive" : "market-negative"}">
        ${positive ? "+" : ""}${item.change.toFixed(2)} • ${item.changePercent}
      </div>
    </div>
  `;
}

function renderMarketChart(items, labelSuffix = "") {
  const ctx = document.getElementById("marketChart");
  if (marketChartInstance) marketChartInstance.destroy();

  marketChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: items.map(item => item.name),
      datasets: [{
        label: `Comparativo atual${labelSuffix}`,
        data: items.map(item => item.price),
        backgroundColor: [
          "rgba(212, 175, 55, 0.85)",
          "rgba(106, 210, 255, 0.85)",
          "rgba(125, 255, 178, 0.85)",
          "rgba(255, 157, 77, 0.85)"
        ],
        borderWidth: 0,
        borderRadius: 8
      }]
    },
    options: getDarkChartOptions()
  });
}

function renderEmptyMarketChart() {
  const ctx = document.getElementById("marketChart");
  if (marketChartInstance) marketChartInstance.destroy();

  marketChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["S&P 500", "NASDAQ 100", "Dow Jones", "Brasil"],
      datasets: [{
        label: "Aguardando dados de mercado",
        data: [0, 0, 0, 0],
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 8
      }]
    },
    options: getDarkChartOptions()
  });
}

function renderMarketData(items, fromCache = false, sourceLabel = "") {
  marketGrid.innerHTML = items.map(buildMarketCard).join("");
  renderMarketChart(items, fromCache ? " (cache)" : "");

  const infoCard = document.createElement("div");
  infoCard.className = "market-note";
  infoCard.textContent = fromCache
    ? `Dados de mercado carregados do cache local${sourceLabel ? ` • ${sourceLabel}` : ""}.`
    : sourceLabel || "Dados de mercado carregados com sucesso.";
  marketGrid.after(infoCard);
}

function clearPreviousMarketNote() {
  document.querySelectorAll(".market-note").forEach(node => node.remove());
}

async function fetchAlphaQuote(symbol) {
  const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`;
  const quoteRes = await fetch(quoteUrl);
  const quoteData = await quoteRes.json();

  if (quoteData.Note) {
    throw new Error("Limite da Alpha Vantage atingido. Aguarde alguns minutos ou use menos consultas.");
  }
  if (quoteData.Information || quoteData['Error Message']) {
    throw new Error(quoteData.Information || quoteData['Error Message']);
  }

  const quote = quoteData["Global Quote"];
  if (!quote || !quote["05. price"]) {
    throw new Error("Sem resposta válida da API.");
  }

  return {
    price: parseFloat(quote["05. price"]),
    change: parseFloat(quote["09. change"] || 0),
    changePercent: quote["10. change percent"] || "0.00%"
  };
}

async function loadMarketData() {
  clearPreviousMarketNote();

  if (DEMO_MODE) {
    renderMarketData(demoMarketData, false, "Modo de demonstração ativado.");
    return;
  }

  if (!ALPHA_VANTAGE_KEY || ALPHA_VANTAGE_KEY === "COLOQUE_SUA_CHAVE_AQUI") {
    marketGrid.innerHTML = `
      <div class="loading-card" style="grid-column: 1 / -1;">
        Adicione sua chave da Alpha Vantage em <strong>config.js</strong> para liberar os dados das bolsas.
      </div>
    `;
    renderEmptyMarketChart();
    return;
  }

  const cached = getMarketCache();
  if (cached && Date.now() - cached.timestamp < MARKET_CACHE_TTL_MS) {
    renderMarketData(cached.data, true, "Atualizado recentemente.");
    return;
  }

  const collected = [];

  try {
    for (const item of marketIndexes) {
      const quote = await fetchAlphaQuote(item.symbol);
      collected.push({ ...item, ...quote });
    }

    saveMarketCache(collected);
    renderMarketData(collected, false, "Cotações obtidas pela Alpha Vantage.");
  } catch (error) {
    console.error(error);

    if (cached?.data?.length) {
      renderMarketData(cached.data, true, error.message);
      return;
    }

    marketGrid.innerHTML = `
      <div class="loading-card" style="grid-column: 1 / -1;">
        Não foi possível carregar os índices agora. Verifique sua chave da Alpha Vantage, o limite diário/minuto da conta gratuita ou tente novamente mais tarde.
      </div>
    `;
    renderEmptyMarketChart();
  }
}

swapBtn.addEventListener("click", async () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  await loadFxHistory(fromCurrency.value, toCurrency.value);
});

convertBtn.addEventListener("click", convertCurrency);
amountInput.addEventListener("keydown", async event => { if (event.key === "Enter") await convertCurrency(); });
fromCurrency.addEventListener("change", async () => { await loadFxHistory(fromCurrency.value, toCurrency.value); });
toCurrency.addEventListener("change", async () => { await loadFxHistory(fromCurrency.value, toCurrency.value); });

function createCoinSVG(symbol) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <defs>
        <radialGradient id="silver" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#f4f4f4"/>
          <stop offset="45%" stop-color="#d8d8d8"/>
          <stop offset="78%" stop-color="#9d9d9d"/>
          <stop offset="100%" stop-color="#6f6f6f"/>
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="16" fill="url(#silver)" stroke="#ececec" stroke-width="1.2"/>
      <circle cx="18" cy="18" r="12.5" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1"/>
      <text x="18" y="22" font-size="14" text-anchor="middle" fill="#d4af37" font-family="Segoe UI, Arial" font-weight="700">${symbol}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function spawnCoinFlash() {
  if (!coinBurstLayer) return;
  const coin = document.createElement("div");
  coin.className = "coin-flash";
  coin.style.left = `${Math.random() * 100}vw`;
  coin.style.top = `${Math.random() * 100}vh`;
  coin.style.animationDelay = `${Math.random() * 0.3}s`;
  coin.style.backgroundImage = `url(${createCoinSVG(Math.random() > 0.5 ? "$" : "€")})`;
  coinBurstLayer.appendChild(coin);
  setTimeout(() => coin.remove(), 2500);
}

setInterval(spawnCoinFlash, 650);
for (let i = 0; i < 12; i++) setTimeout(spawnCoinFlash, i * 180);

Promise.all([loadCurrencies(), loadMarketData()]).then(() => {
  applyUrlDemoState();
});


function applyUrlDemoState() {
  const params = new URLSearchParams(window.location.search);
  const amountParam = params.get("amount");
  const fromParam = params.get("from");
  const toParam = params.get("to");
  const autoConvert = params.get("autoconvert") === "1";
  const scrollTarget = params.get("scroll");

  if (amountParam) amountInput.value = amountParam;
  if (fromParam && [...fromCurrency.options].some(opt => opt.value === fromParam)) fromCurrency.value = fromParam;
  if (toParam && [...toCurrency.options].some(opt => opt.value === toParam)) toCurrency.value = toParam;

  if (autoConvert) {
    setTimeout(() => convertCurrency(), 400);
  }

  if (scrollTarget) {
    const targetMap = {
      fx: "fx-section",
      market: "market-section",
      marketchart: "market-chart-section"
    };
    const target = document.getElementById(targetMap[scrollTarget]);
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: "instant", block: "start" }), 700);
    }
  }
}
