// Unit Converter App

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initCurrencyConverter();
  initTemperatureConverter();
  initLengthConverter();
  initWeightConverter();
  initDataConverter();
  initNavigation();
});

// Tab functionality
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.converter-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      // Update active tab
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show corresponding panel
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `${category}-panel`) {
          panel.classList.add('active');
        }
      });
    });
  });
}

// Currency Converter
let exchangeRates = {};

async function initCurrencyConverter() {
  const fromValue = document.getElementById('currency-from-value');
  const toValue = document.getElementById('currency-to-value');
  const fromUnit = document.getElementById('currency-from-unit');
  const toUnit = document.getElementById('currency-to-unit');
  const swapBtn = document.getElementById('currency-swap');
  const rateInfo = document.getElementById('currency-rate');

  // Fetch exchange rates
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD');
    const data = await response.json();
    exchangeRates = { USD: 1, ...data.rates };
    rateInfo.textContent = `Rates updated: ${data.date}`;
    convertCurrency();
  } catch (error) {
    rateInfo.textContent = 'Using fallback rates (offline mode)';
    // Fallback rates
    exchangeRates = {
      USD: 1, EUR: 0.92, GBP: 0.79, ILS: 3.65, JPY: 149.5,
      CAD: 1.36, AUD: 1.53, CHF: 0.88
    };
    convertCurrency();
  }

  function convertCurrency() {
    const from = fromUnit.value;
    const to = toUnit.value;
    const amount = parseFloat(fromValue.value) || 0;

    // Convert to USD first, then to target currency
    const inUSD = amount / exchangeRates[from];
    const result = inUSD * exchangeRates[to];

    toValue.value = result.toFixed(4);
  }

  fromValue.addEventListener('input', convertCurrency);
  fromUnit.addEventListener('change', convertCurrency);
  toUnit.addEventListener('change', convertCurrency);

  swapBtn.addEventListener('click', () => {
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    convertCurrency();
  });
}

// Temperature Converter
function initTemperatureConverter() {
  const fromValue = document.getElementById('temp-from-value');
  const toValue = document.getElementById('temp-to-value');
  const fromUnit = document.getElementById('temp-from-unit');
  const toUnit = document.getElementById('temp-to-unit');
  const swapBtn = document.getElementById('temp-swap');
  const formulaEl = document.getElementById('temp-formula');

  function convertTemp() {
    const from = fromUnit.value;
    const to = toUnit.value;
    const value = parseFloat(fromValue.value) || 0;

    let celsius;

    // Convert to Celsius first
    switch (from) {
      case 'celsius': celsius = value; break;
      case 'fahrenheit': celsius = (value - 32) * 5 / 9; break;
      case 'kelvin': celsius = value - 273.15; break;
    }

    // Convert from Celsius to target
    let result;
    switch (to) {
      case 'celsius': result = celsius; break;
      case 'fahrenheit': result = (celsius * 9 / 5) + 32; break;
      case 'kelvin': result = celsius + 273.15; break;
    }

    toValue.value = result.toFixed(2);
    updateFormula(from, to);
  }

  function updateFormula(from, to) {
    const formulas = {
      'celsius-fahrenheit': 'Formula: °F = (°C × 9/5) + 32',
      'fahrenheit-celsius': 'Formula: °C = (°F - 32) × 5/9',
      'celsius-kelvin': 'Formula: K = °C + 273.15',
      'kelvin-celsius': 'Formula: °C = K - 273.15',
      'fahrenheit-kelvin': 'Formula: K = (°F - 32) × 5/9 + 273.15',
      'kelvin-fahrenheit': 'Formula: °F = (K - 273.15) × 9/5 + 32'
    };
    const key = `${from}-${to}`;
    formulaEl.textContent = formulas[key] || 'Same unit - no conversion needed';
  }

  fromValue.addEventListener('input', convertTemp);
  fromUnit.addEventListener('change', convertTemp);
  toUnit.addEventListener('change', convertTemp);

  swapBtn.addEventListener('click', () => {
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    convertTemp();
  });

  convertTemp();
}

// Length Converter
function initLengthConverter() {
  const fromValue = document.getElementById('length-from-value');
  const toValue = document.getElementById('length-to-value');
  const fromUnit = document.getElementById('length-from-unit');
  const toUnit = document.getElementById('length-to-unit');
  const swapBtn = document.getElementById('length-swap');

  // Conversion factors to meters
  const toMeters = {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.344,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254
  };

  function convertLength() {
    const from = fromUnit.value;
    const to = toUnit.value;
    const value = parseFloat(fromValue.value) || 0;

    const meters = value * toMeters[from];
    const result = meters / toMeters[to];

    toValue.value = result.toFixed(6);
  }

  fromValue.addEventListener('input', convertLength);
  fromUnit.addEventListener('change', convertLength);
  toUnit.addEventListener('change', convertLength);

  swapBtn.addEventListener('click', () => {
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    convertLength();
  });

  convertLength();
}

// Weight Converter
function initWeightConverter() {
  const fromValue = document.getElementById('weight-from-value');
  const toValue = document.getElementById('weight-to-value');
  const fromUnit = document.getElementById('weight-from-unit');
  const toUnit = document.getElementById('weight-to-unit');
  const swapBtn = document.getElementById('weight-swap');

  // Conversion factors to kilograms
  const toKg = {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    pound: 0.453592,
    ounce: 0.0283495,
    ton: 1000
  };

  function convertWeight() {
    const from = fromUnit.value;
    const to = toUnit.value;
    const value = parseFloat(fromValue.value) || 0;

    const kg = value * toKg[from];
    const result = kg / toKg[to];

    toValue.value = result.toFixed(6);
  }

  fromValue.addEventListener('input', convertWeight);
  fromUnit.addEventListener('change', convertWeight);
  toUnit.addEventListener('change', convertWeight);

  swapBtn.addEventListener('click', () => {
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    convertWeight();
  });

  convertWeight();
}

// Data Converter
function initDataConverter() {
  const fromValue = document.getElementById('data-from-value');
  const toValue = document.getElementById('data-to-value');
  const fromUnit = document.getElementById('data-from-unit');
  const toUnit = document.getElementById('data-to-unit');
  const swapBtn = document.getElementById('data-swap');

  // Conversion factors to bytes
  const toBytes = {
    bit: 0.125,
    byte: 1,
    kilobyte: 1024,
    megabyte: 1024 * 1024,
    gigabyte: 1024 * 1024 * 1024,
    terabyte: 1024 * 1024 * 1024 * 1024
  };

  function convertData() {
    const from = fromUnit.value;
    const to = toUnit.value;
    const value = parseFloat(fromValue.value) || 0;

    const bytes = value * toBytes[from];
    const result = bytes / toBytes[to];

    toValue.value = result.toFixed(6);
  }

  fromValue.addEventListener('input', convertData);
  fromUnit.addEventListener('change', convertData);
  toUnit.addEventListener('change', convertData);

  swapBtn.addEventListener('click', () => {
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    convertData();
  });

  convertData();
}

// Mobile Navigation (simplified version)
function initNavigation() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}
