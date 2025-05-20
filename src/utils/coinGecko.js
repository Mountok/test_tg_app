// src/utils/coinGecko.js
import axios from 'axios';

// берём цены за последние N минут (vs USD)
export async function fetchMarketChart(coinId, minutes = 60) {
  // CoinGecko API: https://www.coingecko.com/api/documentations/v3
  const vs_currency = 'usd';
  const days = 1; // за сегодня — мы возьмём всю историю и потом отсечём последние minutes
  const res = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
    { params: { vs_currency, days } }
  );
  // res.data.prices = [ [timestamp, price], ... ]
  const cutoff = Date.now() - minutes * 60 * 1000;
  return res.data.prices
    .map(([t, p]) => ({ time: t, price: p }))
    .filter(pt => pt.time >= cutoff);
}
