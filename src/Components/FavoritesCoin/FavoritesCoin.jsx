// src/components/FavoritesCoin/FavoritesCoin.jsx
import React, { useState, useEffect } from 'react';
import { fetchMarketChart } from '../../utils/coinGecko';
import './FavoritesCoin.css';
import FavoritesCoinItem from './components/FavoritesCoinIItem';

const ALL_COINS = [
  {
    coinId:   'bitcoin',
    icon:     '/svg/Bitcoin1.svg',
    name:     'Bitcoin',
    shortname:'BTC',
  },
  {
    coinId:   'ethereum',
    icon:     '/svg/Ethereum1.svg',
    name:     'Ethereum',
    shortname:'ETH',
  },
  // сюда можно дописать ещё монет…
];

export default function FavoritesCoin() {
  // фильтр: "В тренде" | "Избранное" | "Все"
  const [filter, setFilter]     = useState('Избранное');
  // state — массив объектов { coinId, icon, name, shortname, price, percent }
  const [coinsData, setCoinsData] = useState([]);

  // Загрузка данных для всех монет
  const loadData = async () => {
    const results = await Promise.all(
      ALL_COINS.map(async ({ coinId, icon, name, shortname }) => {
        const chart = await fetchMarketChart(coinId, 60);
        if (!chart.length) return null;

        const first = chart[0].price;
        const last  = chart[chart.length - 1].price;
        const price   = last.toFixed(2);
        const percent = ((last - first) / first * 100).toFixed(2);

        return { coinId, icon, name, shortname, price, percent };
      })
    );
    // Убираем null’ы
    setCoinsData(results.filter(Boolean));
  };

  useEffect(() => {
    loadData();
    const iv = setInterval(loadData, 60_000); // обновляем каждую минуту
    return () => clearInterval(iv);
  }, []);

  // вычисляем, какой список показывать
  let shown = coinsData;
  if (filter === 'В тренде') {
    // тренд = сортировка по % убыванию, берём топ-3
    shown = [...coinsData]
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 3);
  } else if (filter === 'Избранное') {
    // условно любимые — первые две из ALL_COINS
    shown = coinsData.filter(c =>
      ALL_COINS.slice(0, 2).some(x => x.coinId === c.coinId)
    );
  }
  // для "Все" оставляем весь coinsData

  return (
    <div className="favorites_coin">
      <div className="favorites_coin_filter">
        {['В тренде', 'Избранное', 'Все'].map(tab => (
          <div
            key={tab}
            className={`favorites_coin_filter_item ${
              filter === tab ? 'active' : ''
            }`}
            onClick={() => setFilter(tab)}
          >
            <p>{tab}</p>
          </div>
        ))}
      </div>

      <div className="favorites_coin_list">
        {shown.map(({ icon, name, shortname, price, percent }) => (
          <FavoritesCoinItem
            key={shortname}
            icon={icon}
            name={name}
            shortname={shortname}
            price={price}
            percent={percent}
          />
        ))}
      </div>
    </div>
  );
}