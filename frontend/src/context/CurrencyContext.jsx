import React, { createContext, useContext, useState, useEffect } from 'react';

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', flag: '🇮🇳', name: 'India (INR)', rate: 1 },
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'United States (USD)', rate: 0.012 },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Eurozone (EUR)', rate: 0.011 },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'United Kingdom (GBP)', rate: 0.0094 },
  { code: 'AED', symbol: 'AED ', flag: '🇦🇪', name: 'UAE (AED)', rate: 0.044 },
  { code: 'CAD', symbol: 'CA$', flag: '🇨🇦', name: 'Canada (CAD)', rate: 0.016 },
  { code: 'AUD', symbol: 'AU$', flag: '🇦🇺', name: 'Australia (AUD)', rate: 0.018 },
  { code: 'SGD', symbol: 'S$', flag: '🇸🇬', name: 'Singapore (SGD)', rate: 0.016 },
  { code: 'SAR', symbol: 'SAR ', flag: '🇸🇦', name: 'Saudi Arabia (SAR)', rate: 0.045 },
  { code: 'QAR', symbol: 'QAR ', flag: '🇶🇦', name: 'Qatar (QAR)', rate: 0.044 }
];

export const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('zoniraz_currency') || 'INR';
  });

  const [exchangeRates, setExchangeRates] = useState(() => {
    const initialMap = {};
    SUPPORTED_CURRENCIES.forEach(c => {
      initialMap[c.code] = c.rate;
    });
    return initialMap;
  });

  // Fetch live exchange rates relative to 1 INR base
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/INR')
      .then(res => res.json())
      .then(data => {
        if (data && data.result === 'success' && data.rates) {
          setExchangeRates(prev => {
            const updated = { ...prev };
            SUPPORTED_CURRENCIES.forEach(c => {
              if (data.rates[c.code]) {
                updated[c.code] = data.rates[c.code];
              }
            });
            return updated;
          });
        }
      })
      .catch(() => {
        // Fallback to static rates if offline
      });
  }, []);

  const setCurrency = (code) => {
    setCurrencyState(code);
    localStorage.setItem('zoniraz_currency', code);
  };

  const activeCurrencyConfig = SUPPORTED_CURRENCIES.find(c => c.code === currency) || SUPPORTED_CURRENCIES[0];

  const formatPrice = (amountInINR) => {
    if (amountInINR === undefined || amountInINR === null || isNaN(amountInINR)) {
      return activeCurrencyConfig.symbol + '0';
    }
    const numINR = Number(amountInINR);
    const rate = exchangeRates[currency] || activeCurrencyConfig.rate || 1;
    const converted = numINR * rate;

    if (currency === 'INR') {
      return '₹' + Math.round(converted).toLocaleString('en-IN');
    }

    if (converted >= 1000) {
      return activeCurrencyConfig.symbol + Math.round(converted).toLocaleString();
    } else {
      return activeCurrencyConfig.symbol + converted.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
  };

  const convertPrice = (amountInINR) => {
    if (!amountInINR || isNaN(amountInINR)) return 0;
    const rate = exchangeRates[currency] || activeCurrencyConfig.rate || 1;
    return Number(amountInINR) * rate;
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      currencies: SUPPORTED_CURRENCIES,
      activeCurrencyConfig,
      exchangeRates,
      formatPrice,
      convertPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      currency: 'INR',
      setCurrency: () => {},
      currencies: SUPPORTED_CURRENCIES,
      activeCurrencyConfig: SUPPORTED_CURRENCIES[0],
      exchangeRates: { INR: 1 },
      formatPrice: (amt) => '₹' + Number(amt || 0).toLocaleString('en-IN'),
      convertPrice: (amt) => Number(amt || 0)
    };
  }
  return context;
}
