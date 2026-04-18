const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const result = document.getElementById("result");
const rateInfo = document.getElementById("rateInfo");
const coinBurstLayer = document.getElementById("coinBurstLayer");
const marketGrid = document.getElementById("marketGrid");

const ALPHA_VANTAGE_KEY = "C8VIEAL7LAHPRWYZ";

let fxChartInstance = null;
let marketChartInstance = null;
let availableCurrencies = {};

const marketIndexes = [
  { name: "S&P 500", symbol: "SPY" },
  { name: "NASDAQ 100", symbol: "QQQ" },
  { name: "Dow Jones", symbol: "DIA" },
  { name: "Nikkei Japão", symbol: "EWJ" },
  { name: "FTSE Reino Unido", symbol: "EWU" },
  { name: "DAX Alemanha", symbol: "EWG" },
  { name: "Brasil", symbol: "EWZ" },
  { name: "China", symbol: "MCHI" }
];

const currencyFlags = {
  BRL: "🇧🇷",
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  CAD: "🇨🇦",
  AUD: "🇦🇺",
  CHF: "🇨🇭",
  CNY: "🇨🇳",
  HKD: "🇭🇰",
  NZD: "🇳🇿",
  MXN: "🇲🇽",
  ARS: "🇦🇷",
  CLP: "🇨🇱",
  COP: "🇨🇴",
  ZAR: "🇿🇦",
  SEK: "🇸🇪",
  NOK: "🇳🇴",
  DKK: "🇩🇰",
  PLN: "🇵🇱",
  TRY: "🇹🇷",
  INR: "🇮🇳",
  KRW: "🇰🇷",
  SGD: "🇸🇬",
  THB: "🇹🇭"
};

const preferredOrder = [
  "BRL",
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "HKD",
  "NZD",
  "MXN",
  "ARS",
  "CLP",
  "COP",
  "INR",
  "KRW",
  "SGD"
];

function getCurrencyLabel(code, name) {
  const flag = currencyFlags[code] ? `${currencyFlags[code]} ` : "";
  return `${flag}${code} - ${name}`;
}

async function loadCurrencies() {
  try {
    const response = await fetch("https://api.frankfurter.dev/v1/currencies");

    if (!response.ok) {
      throw new Error("Falha ao carregar a lista de moedas.");
    }

    const currencies = await response.json();
    availableCurrencies = currencies;

    const sortedCodes = [
      ...preferredOrder.filter(code => currencies[code]),
      ...Object.keys(currencies)
        .filter(code => !preferredOrder.includes(code))
        .sort((a, b) => a.localeCompare(b))
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

    await loadFxHistory(fromCurrency.value, toCurrency.value);
  }
}

function formatMoney(value, currencyCode) {
  const localeMap = {
    BRL: "pt-BR",
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    JPY: "ja-JP",
    CAD: "en-CA",
    AUD: "en-AU",
    CHF: "de-CH"
  };

  try {
    return new Intl.NumberFormat(localeMap[currencyCode] || "en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currencyCode}`;
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
  result.className = "result-main";
  rateInfo.textContent = "Buscando cotação em tempo real...";

  try {
    const url = `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Falha ao consultar a API de câmbio.");
    }

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

function getDateRange(days) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0]
  };
}

async function loadFxHistory(from, to) {
  if (!from || !to) return;

  const { start, end } = getDateRange(30);

  try {
    const url = `https://api.frankfurter.dev/v1/${start}..${end}?base=${from}&symbols=${to}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar histórico cambial.");
    }

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

  if (fxChartInstance) {
    fxChartInstance.destroy();
  }

  fxChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `Histórico ${pairLabel}`,
          data: values,
          borderColor: "#d4af37",
          backgroundColor: "rgba(212, 175, 55, 0.16)",
          borderWidth: 2,
          tension: 0.25,
          fill: true,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#f1f1f1"
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#bbbbbb" },
          grid: { color: "rgba(255,255,255,0.06)" }
        },
        y: {
          ticks: { color: "#bbbbbb" },
          grid: { color: "rgba(255,255,255,0.06)" }
        }
      }
    }
  });
}

async function loadMarketData() {
  if (!ALPHA_VANTAGE_KEY || ALPHA_VANTAGE_KEY === "COLOQUE_SUA_CHAVE_AQUI") {
    marketGrid.innerHTML = `
      <div class="loading-card" style="grid-column: 1 / -1;">
        Adicione sua chave da Alpha Vantage em <strong>ALPHA_VANTAGE_KEY</strong> para liberar os dados das bolsas.
      </div>
    `;
    renderEmptyMarketChart();
    return;
  }

  const cardsHtml = [];
  const chartLabels = [];
  const datasets = [];

  for (let i = 0; i < marketIndexes.length; i++) {
    const item = marketIndexes[i];

    try {
      const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${item.symbol}&apikey=${ALPHA_VANTAGE_KEY}`;
      const quoteRes = await fetch(quoteUrl);
      const quoteData = await quoteRes.json();
      const quote = quoteData["Global Quote"];

      if (!quote || !quote["05. price"]) {
        cardsHtml.push(`
          <div class="market-card">
            <div class="market-name">${item.name}</div>
            <div class="market-symbol">${item.symbol}</div>
            <div class="market-price">Indisponível</div>
            <div class="market-change market-negative">Sem resposta da API</div>
          </div>
        `);
        continue;
      }

      const price = parseFloat(quote["05. price"]);
      const change = parseFloat(quote["09. change"]);
      const changePercent = quote["10. change percent"];
      const positive = change >= 0;

      cardsHtml.push(`
        <div class="market-card">
          <div class="market-name">${item.name}</div>
          <div class="market-symbol">${item.symbol}</div>
          <div class="market-price">${price.toFixed(2)}</div>
          <div class="market-change ${positive ? "market-positive" : "market-negative"}">
            ${positive ? "+" : ""}${change.toFixed(2)} • ${changePercent}
          </div>
        </div>
      `);

      const seriesUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${item.symbol}&outputsize=compact&apikey=${ALPHA_VANTAGE_KEY}`;
      const seriesRes = await fetch(seriesUrl);
      const seriesData = await seriesRes.json();
      const series = seriesData["Time Series (Daily)"];

      if (series) {
        const dates = Object.keys(series).sort().slice(-12);
        const closes = dates.map(date => parseFloat(series[date]["4. close"]));

        if (chartLabels.length === 0) {
          chartLabels.push(...dates);
        }

        datasets.push({
          label: item.name,
          data: closes,
          borderWidth: 2,
          tension: 0.25
        });
      }
    } catch (error) {
      console.error(`Erro ao carregar ${item.symbol}:`, error);
      cardsHtml.push(`
        <div class="market-card">
          <div class="market-name">${item.name}</div>
          <div class="market-symbol">${item.symbol}</div>
          <div class="market-price">Erro</div>
          <div class="market-change market-negative">Falha ao carregar</div>
        </div>
      `);
    }
  }

  marketGrid.innerHTML = cardsHtml.join("");

  if (datasets.length > 0) {
    renderMarketChart(chartLabels, datasets);
  } else {
    renderEmptyMarketChart();
  }
}

function renderMarketChart(labels, datasets) {
  const ctx = document.getElementById("marketChart");

  if (marketChartInstance) {
    marketChartInstance.destroy();
  }

  marketChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#f1f1f1"
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#bbbbbb" },
          grid: { color: "rgba(255,255,255,0.06)" }
        },
        y: {
          ticks: { color: "#bbbbbb" },
          grid: { color: "rgba(255,255,255,0.06)" }
        }
      }
    }
  });
}

function renderEmptyMarketChart() {
  const ctx = document.getElementById("marketChart");

  if (marketChartInstance) {
    marketChartInstance.destroy();
  }

  marketChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["1", "2", "3", "4"],
      datasets: [
        {
          label: "Aguardando dados de mercado",
          data: [0, 0, 0, 0],
          borderColor: "#666",
          backgroundColor: "rgba(255,255,255,0.06)",
          borderWidth: 2,
          tension: 0.25
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#f1f1f1"
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#bbbbbb" },
          grid: { color: "rgba(255,255,255,0.06)" }
        },
        y: {
          ticks: { color: "#bbbbbb" },
          grid: { color: "rgba(255,255,255,0.06)" }
        }
      }
    }
  });
}

swapBtn.addEventListener("click", async () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  await loadFxHistory(fromCurrency.value, toCurrency.value);
});

convertBtn.addEventListener("click", convertCurrency);

amountInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    await convertCurrency();
  }
});

fromCurrency.addEventListener("change", async () => {
  await loadFxHistory(fromCurrency.value, toCurrency.value);
});

toCurrency.addEventListener("change", async () => {
  await loadFxHistory(fromCurrency.value, toCurrency.value);
});

function createCoinSVG(symbol) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <defs>
        <radialGradient id="silver" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#f4f4f4"/>
          <stop offset="45%" stop-color="#d8d8d8"/>
          <stop offset="78%" stop-color="#9d9d9d"/>
          <stop offset="100%" stop-color="#7a7a7a"/>
        </radialGradient>
        <radialGradient id="gold" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ffe9a6"/>
          <stop offset="55%" stop-color="#d4af37"/>
          <stop offset="100%" stop-color="#9d7415"/>
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="16.5" fill="url(#silver)" stroke="#ececec" stroke-width="1.2"/>
      <circle cx="18" cy="18" r="13.3" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
      <text x="18" y="21"
            text-anchor="middle"
            font-size="${symbol.length > 2 ? 8 : 13}"
            font-family="Segoe UI, Arial, sans-serif"
            font-weight="700"
            fill="url(#gold)">${symbol}</text>
    </svg>
  `;

  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

function spawnSingleCoin() {
  const symbols = ["$", "€", "£", "¥", "R$", "C$", "A$", "CHF"];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];

  const coin = document.createElement("div");
  coin.className = "coin-flash";
  coin.style.backgroundImage = createCoinSVG(symbol);
  coin.style.left = `${Math.random() * 92 + 2}%`;
  coin.style.top = `${Math.random() * 82 + 4}%`;

  coinBurstLayer.appendChild(coin);

  setTimeout(() => {
    coin.remove();
  }, 2600);
}

function startCoinLoop() {
  spawnSingleCoin();

  setInterval(() => {
    const quantity = Math.random() < 0.3 ? 2 : 1;
    for (let i = 0; i < quantity; i++) {
      setTimeout(spawnSingleCoin, i * 280);
    }
  }, 3200);
}

loadCurrencies();
loadMarketData();
startCoinLoop();
