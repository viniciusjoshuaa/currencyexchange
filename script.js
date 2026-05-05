const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const result = document.getElementById("result");
const rateInfo = document.getElementById("rateInfo");
const coinBurstLayer = document.getElementById("coinBurstLayer");
const marketGrid = document.getElementById("marketGrid");


const translations = {
  pt: {
    htmlLang: "pt-BR",
    appTitle: "Polanski's Converter",
    heroSubtitle: "Código construído com aplicação de APIs em tempo real.",
    brandBadge: "Currency Exchange",
    liveConversion: "Conversão em tempo real",
    amountLabel: "Valor",
    amountPlaceholder: "Digite o valor",
    fromLabel: "De",
    toLabel: "Para",
    swapTitle: "Inverter moedas",
    convertButton: "Converter agora",
    initialResult: "O resultado aparecerá aqui",
    loadingCurrencies: "Carregando lista de moedas...",
    fxHistoryTitle: "Histórico cambial",
    fxHistorySubtitle: "Últimos 30 dias da cotação entre as moedas escolhidas",
    marketTitle: "Bolsas do mundo",
    marketSubtitle: "Resumo dos principais índices globais",
    marketChartTitle: "Gráfico dos índices",
    marketChartSubtitle: "Fechamentos recentes dos mercados",
    loadingIndexes: "Carregando índices...",
    invalidAmount: "Digite um valor válido.",
    amountMustBePositive: "O valor precisa ser maior que zero.",
    selectCurrencies: "Selecione as moedas.",
    chooseCurrencies: "Escolha uma moeda de origem e uma de destino.",
    sameCurrency: "As moedas são iguais, então o valor permanece o mesmo.",
    converting: "Convertendo...",
    fetchingRate: "Buscando cotação em tempo real...",
    rateDate: "Data da cotação",
    conversionError: "Erro ao converter.",
    conversionErrorInfo: "Não foi possível buscar a cotação online agora.",
    currencyLoadError: "Não foi possível carregar a lista completa de moedas.",
    chartHistory: "Histórico",
    addApiKey: "Adicione sua chave da Alpha Vantage em",
    unlockMarketData: "para liberar os dados das bolsas.",
    unavailable: "Indisponível",
    noApiResponse: "Sem resposta da API",
    error: "Erro",
    loadFailed: "Falha ao carregar",
    waitingMarketData: "Aguardando dados de mercado",
    marketNames: { "S&P 500": "S&P 500", "NASDAQ 100": "NASDAQ 100", "Dow Jones": "Dow Jones", "Nikkei Japan": "Nikkei Japão", "FTSE United Kingdom": "FTSE Reino Unido", "DAX Germany": "DAX Alemanha", Brazil: "Brasil", China: "China" },
    fallbackCurrencies: { BRL: "Real Brasileiro", USD: "Dólar Americano", EUR: "Euro", GBP: "Libra Esterlina", JPY: "Iene Japonês", CAD: "Dólar Canadense", AUD: "Dólar Australiano", CHF: "Franco Suíço" }
  },
  en: {
    htmlLang: "en-GB", appTitle: "Polanski's Converter", heroSubtitle: "Built with real-time API integration.", brandBadge: "Currency Exchange", liveConversion: "Real-time conversion", amountLabel: "Amount", amountPlaceholder: "Enter amount", fromLabel: "From", toLabel: "To", swapTitle: "Swap currencies", convertButton: "Convert now", initialResult: "The result will appear here", loadingCurrencies: "Loading currency list...", fxHistoryTitle: "Exchange rate history", fxHistorySubtitle: "Last 30 days for the selected currency pair", marketTitle: "World markets", marketSubtitle: "Overview of major global indexes", marketChartTitle: "Index chart", marketChartSubtitle: "Recent market closes", loadingIndexes: "Loading indexes...", invalidAmount: "Enter a valid amount.", amountMustBePositive: "The amount must be greater than zero.", selectCurrencies: "Select currencies.", chooseCurrencies: "Choose a source and target currency.", sameCurrency: "The currencies are the same, so the value remains unchanged.", converting: "Converting...", fetchingRate: "Fetching real-time exchange rate...", rateDate: "Rate date", conversionError: "Conversion error.", conversionErrorInfo: "It was not possible to fetch the online rate right now.", currencyLoadError: "It was not possible to load the full currency list.", chartHistory: "History", addApiKey: "Add your Alpha Vantage key in", unlockMarketData: "to unlock stock market data.", unavailable: "Unavailable", noApiResponse: "No API response", error: "Error", loadFailed: "Failed to load", waitingMarketData: "Waiting for market data",
    marketNames: { "S&P 500": "S&P 500", "NASDAQ 100": "NASDAQ 100", "Dow Jones": "Dow Jones", "Nikkei Japan": "Nikkei Japan", "FTSE United Kingdom": "FTSE United Kingdom", "DAX Germany": "DAX Germany", Brazil: "Brazil", China: "China" },
    fallbackCurrencies: { BRL: "Brazilian Real", USD: "US Dollar", EUR: "Euro", GBP: "Pound Sterling", JPY: "Japanese Yen", CAD: "Canadian Dollar", AUD: "Australian Dollar", CHF: "Swiss Franc" }
  },
  es: {
    htmlLang: "es", appTitle: "Polanski's Converter", heroSubtitle: "Código creado con integración de APIs en tiempo real.", brandBadge: "Cambio de divisas", liveConversion: "Conversión en tiempo real", amountLabel: "Importe", amountPlaceholder: "Introduce el importe", fromLabel: "De", toLabel: "A", swapTitle: "Invertir monedas", convertButton: "Convertir ahora", initialResult: "El resultado aparecerá aquí", loadingCurrencies: "Cargando lista de monedas...", fxHistoryTitle: "Histórico cambiario", fxHistorySubtitle: "Últimos 30 días para el par de monedas seleccionado", marketTitle: "Bolsas del mundo", marketSubtitle: "Resumen de los principales índices globales", marketChartTitle: "Gráfico de índices", marketChartSubtitle: "Cierres recientes de los mercados", loadingIndexes: "Cargando índices...", invalidAmount: "Introduce un importe válido.", amountMustBePositive: "El importe debe ser mayor que cero.", selectCurrencies: "Selecciona las monedas.", chooseCurrencies: "Elige una moneda de origen y una de destino.", sameCurrency: "Las monedas son iguales, por lo que el valor no cambia.", converting: "Convirtiendo...", fetchingRate: "Buscando cotización en tiempo real...", rateDate: "Fecha de cotización", conversionError: "Error al convertir.", conversionErrorInfo: "No fue posible obtener la cotización online ahora.", currencyLoadError: "No fue posible cargar la lista completa de monedas.", chartHistory: "Histórico", addApiKey: "Añade tu clave de Alpha Vantage en", unlockMarketData: "para habilitar los datos bursátiles.", unavailable: "No disponible", noApiResponse: "Sin respuesta de la API", error: "Error", loadFailed: "Error al cargar", waitingMarketData: "Esperando datos de mercado",
    marketNames: { "S&P 500": "S&P 500", "NASDAQ 100": "NASDAQ 100", "Dow Jones": "Dow Jones", "Nikkei Japan": "Nikkei Japón", "FTSE United Kingdom": "FTSE Reino Unido", "DAX Germany": "DAX Alemania", Brazil: "Brasil", China: "China" },
    fallbackCurrencies: { BRL: "Real brasileño", USD: "Dólar estadounidense", EUR: "Euro", GBP: "Libra esterlina", JPY: "Yen japonés", CAD: "Dólar canadiense", AUD: "Dólar australiano", CHF: "Franco suizo" }
  },
  it: {
    htmlLang: "it", appTitle: "Polanski's Converter", heroSubtitle: "Codice realizzato con integrazione di API in tempo reale.", brandBadge: "Cambio valuta", liveConversion: "Conversione in tempo reale", amountLabel: "Importo", amountPlaceholder: "Inserisci l'importo", fromLabel: "Da", toLabel: "A", swapTitle: "Inverti valute", convertButton: "Converti ora", initialResult: "Il risultato apparirà qui", loadingCurrencies: "Caricamento elenco valute...", fxHistoryTitle: "Storico dei cambi", fxHistorySubtitle: "Ultimi 30 giorni per la coppia di valute selezionata", marketTitle: "Borse mondiali", marketSubtitle: "Panoramica dei principali indici globali", marketChartTitle: "Grafico degli indici", marketChartSubtitle: "Chiusure recenti dei mercati", loadingIndexes: "Caricamento indici...", invalidAmount: "Inserisci un importo valido.", amountMustBePositive: "L'importo deve essere maggiore di zero.", selectCurrencies: "Seleziona le valute.", chooseCurrencies: "Scegli una valuta di origine e una di destinazione.", sameCurrency: "Le valute sono uguali, quindi il valore rimane invariato.", converting: "Conversione in corso...", fetchingRate: "Ricerca del tasso di cambio in tempo reale...", rateDate: "Data del tasso", conversionError: "Errore di conversione.", conversionErrorInfo: "Non è stato possibile ottenere il tasso online adesso.", currencyLoadError: "Non è stato possibile caricare l'elenco completo delle valute.", chartHistory: "Storico", addApiKey: "Aggiungi la tua chiave Alpha Vantage in", unlockMarketData: "per abilitare i dati di borsa.", unavailable: "Non disponibile", noApiResponse: "Nessuna risposta dall'API", error: "Errore", loadFailed: "Caricamento non riuscito", waitingMarketData: "In attesa dei dati di mercato",
    marketNames: { "S&P 500": "S&P 500", "NASDAQ 100": "NASDAQ 100", "Dow Jones": "Dow Jones", "Nikkei Japan": "Nikkei Giappone", "FTSE United Kingdom": "FTSE Regno Unito", "DAX Germany": "DAX Germania", Brazil: "Brasile", China: "Cina" },
    fallbackCurrencies: { BRL: "Real brasiliano", USD: "Dollaro statunitense", EUR: "Euro", GBP: "Sterlina britannica", JPY: "Yen giapponese", CAD: "Dollaro canadese", AUD: "Dollaro australiano", CHF: "Franco svizzero" }
  },
  hi: {
    htmlLang: "hi", appTitle: "Polanski's Converter", heroSubtitle: "रीयल-टाइम API इंटीग्रेशन के साथ बनाया गया कोड।", brandBadge: "मुद्रा विनिमय", liveConversion: "रीयल-टाइम रूपांतरण", amountLabel: "राशि", amountPlaceholder: "राशि दर्ज करें", fromLabel: "से", toLabel: "तक", swapTitle: "मुद्राएं बदलें", convertButton: "अभी कन्वर्ट करें", initialResult: "परिणाम यहां दिखाई देगा", loadingCurrencies: "मुद्राओं की सूची लोड हो रही है...", fxHistoryTitle: "विनिमय दर इतिहास", fxHistorySubtitle: "चुनी गई मुद्राओं के लिए पिछले 30 दिनों की दरें", marketTitle: "विश्व बाजार", marketSubtitle: "मुख्य वैश्विक सूचकांकों का सारांश", marketChartTitle: "सूचकांक चार्ट", marketChartSubtitle: "हाल के बाजार बंद भाव", loadingIndexes: "सूचकांक लोड हो रहे हैं...", invalidAmount: "मान्य राशि दर्ज करें।", amountMustBePositive: "राशि शून्य से अधिक होनी चाहिए।", selectCurrencies: "मुद्राएं चुनें।", chooseCurrencies: "स्रोत और लक्ष्य मुद्रा चुनें।", sameCurrency: "मुद्राएं समान हैं, इसलिए राशि नहीं बदलती।", converting: "कन्वर्ट हो रहा है...", fetchingRate: "रीयल-टाइम विनिमय दर प्राप्त की जा रही है...", rateDate: "दर की तारीख", conversionError: "रूपांतरण त्रुटि।", conversionErrorInfo: "अभी ऑनलाइन दर प्राप्त नहीं हो सकी।", currencyLoadError: "पूरी मुद्रा सूची लोड नहीं हो सकी।", chartHistory: "इतिहास", addApiKey: "Alpha Vantage key यहां जोड़ें", unlockMarketData: "ताकि बाजार डेटा उपलब्ध हो सके।", unavailable: "उपलब्ध नहीं", noApiResponse: "API से कोई जवाब नहीं", error: "त्रुटि", loadFailed: "लोड करने में विफल", waitingMarketData: "बाजार डेटा की प्रतीक्षा है",
    marketNames: { "S&P 500": "S&P 500", "NASDAQ 100": "NASDAQ 100", "Dow Jones": "Dow Jones", "Nikkei Japan": "निक्केई जापान", "FTSE United Kingdom": "FTSE यूनाइटेड किंगडम", "DAX Germany": "DAX जर्मनी", Brazil: "ब्राज़ील", China: "चीन" },
    fallbackCurrencies: { BRL: "ब्राज़ीलियन रियल", USD: "अमेरिकी डॉलर", EUR: "यूरो", GBP: "पाउंड स्टर्लिंग", JPY: "जापानी येन", CAD: "कनाडाई डॉलर", AUD: "ऑस्ट्रेलियाई डॉलर", CHF: "स्विस फ्रैंक" }
  },
  ru: {
    htmlLang: "ru", appTitle: "Polanski's Converter", heroSubtitle: "Код создан с использованием API в реальном времени.", brandBadge: "Обмен валют", liveConversion: "Конвертация в реальном времени", amountLabel: "Сумма", amountPlaceholder: "Введите сумму", fromLabel: "Из", toLabel: "В", swapTitle: "Поменять валюты", convertButton: "Конвертировать", initialResult: "Результат появится здесь", loadingCurrencies: "Загрузка списка валют...", fxHistoryTitle: "История обменного курса", fxHistorySubtitle: "Последние 30 дней для выбранной валютной пары", marketTitle: "Мировые рынки", marketSubtitle: "Обзор основных мировых индексов", marketChartTitle: "График индексов", marketChartSubtitle: "Последние закрытия рынков", loadingIndexes: "Загрузка индексов...", invalidAmount: "Введите корректную сумму.", amountMustBePositive: "Сумма должна быть больше нуля.", selectCurrencies: "Выберите валюты.", chooseCurrencies: "Выберите исходную и целевую валюту.", sameCurrency: "Валюты одинаковые, поэтому значение не изменилось.", converting: "Конвертация...", fetchingRate: "Получение курса в реальном времени...", rateDate: "Дата курса", conversionError: "Ошибка конвертации.", conversionErrorInfo: "Не удалось получить онлайн-курс сейчас.", currencyLoadError: "Не удалось загрузить полный список валют.", chartHistory: "История", addApiKey: "Добавьте ваш ключ Alpha Vantage в", unlockMarketData: "чтобы открыть данные фондового рынка.", unavailable: "Недоступно", noApiResponse: "Нет ответа от API", error: "Ошибка", loadFailed: "Не удалось загрузить", waitingMarketData: "Ожидание рыночных данных",
    marketNames: { "S&P 500": "S&P 500", "NASDAQ 100": "NASDAQ 100", "Dow Jones": "Dow Jones", "Nikkei Japan": "Nikkei Япония", "FTSE United Kingdom": "FTSE Великобритания", "DAX Germany": "DAX Германия", Brazil: "Бразилия", China: "Китай" },
    fallbackCurrencies: { BRL: "Бразильский реал", USD: "Доллар США", EUR: "Евро", GBP: "Фунт стерлингов", JPY: "Японская иена", CAD: "Канадский доллар", AUD: "Австралийский доллар", CHF: "Швейцарский франк" }
  },
  ja: {
    htmlLang: "ja", appTitle: "Polanski's Converter", heroSubtitle: "リアルタイムAPI連携で構築されたコードです。", brandBadge: "為替変換", liveConversion: "リアルタイム変換", amountLabel: "金額", amountPlaceholder: "金額を入力", fromLabel: "変換元", toLabel: "変換先", swapTitle: "通貨を入れ替える", convertButton: "今すぐ変換", initialResult: "結果はここに表示されます", loadingCurrencies: "通貨リストを読み込み中...", fxHistoryTitle: "為替レート履歴", fxHistorySubtitle: "選択した通貨ペアの過去30日間", marketTitle: "世界の市場", marketSubtitle: "主要な世界指数の概要", marketChartTitle: "指数チャート", marketChartSubtitle: "最近の市場終値", loadingIndexes: "指数を読み込み中...", invalidAmount: "有効な金額を入力してください。", amountMustBePositive: "金額は0より大きい必要があります。", selectCurrencies: "通貨を選択してください。", chooseCurrencies: "変換元と変換先の通貨を選択してください。", sameCurrency: "同じ通貨のため、金額は変わりません。", converting: "変換中...", fetchingRate: "リアルタイム為替レートを取得中...", rateDate: "レートの日付", conversionError: "変換エラー。", conversionErrorInfo: "現在オンラインレートを取得できません。", currencyLoadError: "完全な通貨リストを読み込めませんでした。", chartHistory: "履歴", addApiKey: "Alpha Vantageキーを追加してください:", unlockMarketData: "株式市場データを有効にするため。", unavailable: "利用不可", noApiResponse: "APIから応答がありません", error: "エラー", loadFailed: "読み込み失敗", waitingMarketData: "市場データを待機中",
    marketNames: { "S&P 500": "S&P 500", "NASDAQ 100": "NASDAQ 100", "Dow Jones": "Dow Jones", "Nikkei Japan": "日経 日本", "FTSE United Kingdom": "FTSE イギリス", "DAX Germany": "DAX ドイツ", Brazil: "ブラジル", China: "中国" },
    fallbackCurrencies: { BRL: "ブラジルレアル", USD: "米ドル", EUR: "ユーロ", GBP: "英ポンド", JPY: "日本円", CAD: "カナダドル", AUD: "豪ドル", CHF: "スイスフラン" }
  },
  zh: {
    htmlLang: "zh-CN", appTitle: "Polanski's Converter", heroSubtitle: "使用实时 API 集成构建的代码。", brandBadge: "货币兑换", liveConversion: "实时转换", amountLabel: "金额", amountPlaceholder: "输入金额", fromLabel: "从", toLabel: "到", swapTitle: "交换货币", convertButton: "立即转换", initialResult: "结果将显示在这里", loadingCurrencies: "正在加载货币列表...", fxHistoryTitle: "汇率历史", fxHistorySubtitle: "所选货币对最近30天的汇率", marketTitle: "全球市场", marketSubtitle: "主要全球指数概览", marketChartTitle: "指数图表", marketChartSubtitle: "近期市场收盘数据", loadingIndexes: "正在加载指数...", invalidAmount: "请输入有效金额。", amountMustBePositive: "金额必须大于零。", selectCurrencies: "请选择货币。", chooseCurrencies: "请选择源货币和目标货币。", sameCurrency: "两种货币相同，因此金额不变。", converting: "正在转换...", fetchingRate: "正在获取实时汇率...", rateDate: "汇率日期", conversionError: "转换错误。", conversionErrorInfo: "当前无法获取在线汇率。", currencyLoadError: "无法加载完整货币列表。", chartHistory: "历史", addApiKey: "请在此添加您的 Alpha Vantage 密钥", unlockMarketData: "以启用股票市场数据。", unavailable: "不可用", noApiResponse: "API 无响应", error: "错误", loadFailed: "加载失败", waitingMarketData: "等待市场数据",
    marketNames: { "S&P 500": "S&P 500", "NASDAQ 100": "NASDAQ 100", "Dow Jones": "Dow Jones", "Nikkei Japan": "日经 日本", "FTSE United Kingdom": "FTSE 英国", "DAX Germany": "DAX 德国", Brazil: "巴西", China: "中国" },
    fallbackCurrencies: { BRL: "巴西雷亚尔", USD: "美元", EUR: "欧元", GBP: "英镑", JPY: "日元", CAD: "加拿大元", AUD: "澳大利亚元", CHF: "瑞士法郎" }
  }
};

let currentLanguage = localStorage.getItem("siteLanguage") || "pt";

function getLangPack() {
  return translations[currentLanguage] || translations.pt;
}

function t(key) {
  return getLangPack()[key] || translations.en[key] || translations.pt[key] || key;
}

function nestedT(group, key) {
  const langGroup = getLangPack()[group] || {};
  const enGroup = translations.en[group] || {};
  const ptGroup = translations.pt[group] || {};
  return langGroup[key] || enGroup[key] || ptGroup[key] || key;
}

function applyLanguage(lang) {
  currentLanguage = translations[lang] ? lang : "pt";
  localStorage.setItem("siteLanguage", currentLanguage);
  document.documentElement.lang = t("htmlLang");
  document.title = t("appTitle");

  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-title]").forEach(element => {
    element.title = t(element.dataset.i18nTitle);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach(element => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });

  document.querySelectorAll(".language-switcher button").forEach(button => {
    button.classList.toggle("active", button.getAttribute("onclick")?.includes(`'${currentLanguage}'`));
  });

  if (result && result.dataset.i18n === "initialResult") result.textContent = t("initialResult");
  if (rateInfo && rateInfo.dataset.i18n === "loadingCurrencies") rateInfo.textContent = t("loadingCurrencies");
}

function setLanguage(lang) {
  applyLanguage(lang);
  refreshCurrencyLabels();
  refreshMarketStaticText();
}

function refreshCurrencyLabels() {
  if (!availableCurrencies || Object.keys(availableCurrencies).length === 0) return;
  const fromValue = fromCurrency.value;
  const toValue = toCurrency.value;
  Array.from(fromCurrency.options).forEach(option => option.textContent = getCurrencyLabel(option.value, availableCurrencies[option.value]));
  Array.from(toCurrency.options).forEach(option => option.textContent = getCurrencyLabel(option.value, availableCurrencies[option.value]));
  fromCurrency.value = fromValue;
  toCurrency.value = toValue;
}

function refreshMarketStaticText() {
  if (marketGrid && marketGrid.querySelector(".loading-card") && marketGrid.textContent.trim()) {
    const loading = marketGrid.querySelector(".loading-card[data-i18n='loadingIndexes']");
    if (loading) loading.textContent = t("loadingIndexes");
  }
}

const ALPHA_VANTAGE_KEY = "C8VIEAL7LAHPRWYZ";

let fxChartInstance = null;
let marketChartInstance = null;
let availableCurrencies = {};

const marketIndexes = [
  { name: "S&P 500", symbol: "SPY" },
  { name: "NASDAQ 100", symbol: "QQQ" },
  { name: "Dow Jones", symbol: "DIA" },
  { name: "Nikkei Japan", symbol: "EWJ" },
  { name: "FTSE United Kingdom", symbol: "EWU" },
  { name: "DAX Germany", symbol: "EWG" },
  { name: "Brazil", symbol: "EWZ" },
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
  return `${flag}${code} - ${nestedT("fallbackCurrencies", code) !== code ? nestedT("fallbackCurrencies", code) : name}`;
}

async function loadCurrencies() {
  try {
    const response = await fetch("https://api.frankfurter.dev/v1/currencies");

    if (!response.ok) {
      throw new Error(t("currencyLoadError"));
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

    rateInfo.textContent = t("currencyLoadError");

    fromCurrency.innerHTML = `
      <option value="BRL">${getCurrencyLabel("BRL", "Brazilian Real")}</option>
      <option value="USD">${getCurrencyLabel("USD", "US Dollar")}</option>
      <option value="EUR">${getCurrencyLabel("EUR", "Euro")}</option>
      <option value="GBP">${getCurrencyLabel("GBP", "Pound Sterling")}</option>
      <option value="JPY">${getCurrencyLabel("JPY", "Japanese Yen")}</option>
      <option value="CAD">${getCurrencyLabel("CAD", "Canadian Dollar")}</option>
      <option value="AUD">${getCurrencyLabel("AUD", "Australian Dollar")}</option>
      <option value="CHF">${getCurrencyLabel("CHF", "Swiss Franc")}</option>
    `;

    toCurrency.innerHTML = `
      <option value="USD">${getCurrencyLabel("USD", "US Dollar")}</option>
      <option value="BRL">${getCurrencyLabel("BRL", "Brazilian Real")}</option>
      <option value="EUR">${getCurrencyLabel("EUR", "Euro")}</option>
      <option value="GBP">${getCurrencyLabel("GBP", "Pound Sterling")}</option>
      <option value="JPY">${getCurrencyLabel("JPY", "Japanese Yen")}</option>
      <option value="CAD">${getCurrencyLabel("CAD", "Canadian Dollar")}</option>
      <option value="AUD">${getCurrencyLabel("AUD", "Australian Dollar")}</option>
      <option value="CHF">${getCurrencyLabel("CHF", "Swiss Franc")}</option>
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
    result.textContent = t("invalidAmount");
    result.className = "result-main error";
    rateInfo.textContent = t("amountMustBePositive");
    return;
  }

  if (!from || !to) {
    result.textContent = t("selectCurrencies");
    result.className = "result-main error";
    rateInfo.textContent = t("chooseCurrencies");
    return;
  }

  if (from === to) {
    result.textContent = `${formatMoney(amount, from)} = ${formatMoney(amount, to)}`;
    result.className = "result-main success";
    rateInfo.textContent = t("sameCurrency");
    await loadFxHistory(from, to);
    return;
  }

  result.textContent = t("converting");
  result.className = "result-main";
  rateInfo.textContent = t("fetchingRate");

  try {
    const url = `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(t("conversionError"));
    }

    const data = await response.json();
    const rate = data.rates[to];
    const converted = amount * rate;

    result.textContent = `${formatMoney(amount, from)} = ${formatMoney(converted, to)}`;
    result.className = "result-main success";
    rateInfo.textContent = `1 ${from} = ${rate.toFixed(6)} ${to} • ${t("rateDate")}: ${data.date}`;

    await loadFxHistory(from, to);
  } catch (error) {
    result.textContent = t("conversionError");
    result.className = "result-main error";
    rateInfo.textContent = t("conversionErrorInfo");
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
      throw new Error(t("conversionError"));
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
          label: `${t("chartHistory")} ${pairLabel}`,
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
        ${t("addApiKey")} <strong>ALPHA_VANTAGE_KEY</strong> ${t("unlockMarketData")}
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
            <div class="market-name">${nestedT("marketNames", item.name)}</div>
            <div class="market-symbol">${item.symbol}</div>
            <div class="market-price">${t("unavailable")}</div>
            <div class="market-change market-negative">${t("noApiResponse")}</div>
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
          <div class="market-name">${nestedT("marketNames", item.name)}</div>
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
          label: nestedT("marketNames", item.name),
          data: closes,
          borderWidth: 2,
          tension: 0.25
        });
      }
    } catch (error) {
      console.error(`${t("error")} ${item.symbol}:`, error);
      cardsHtml.push(`
        <div class="market-card">
          <div class="market-name">${nestedT("marketNames", item.name)}</div>
          <div class="market-symbol">${item.symbol}</div>
          <div class="market-price">${t("error")}</div>
          <div class="market-change market-negative">${t("loadFailed")}</div>
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
          label: t("waitingMarketData"),
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

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(currentLanguage);
  loadCurrencies();
  loadMarketData();
  startCoinLoop();
});