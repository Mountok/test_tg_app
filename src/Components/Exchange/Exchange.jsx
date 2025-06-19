import React, { useEffect, useState } from 'react';
import { IoChevronBackSharp, IoChevronDown } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';
import './Exchange.css';

const COINS = [
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
  { id: 'tether', symbol: 'USDT', name: 'Tether', icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png' },
  { id: 'ruble', symbol: 'RUB', name: 'Рубль', icon: '' },
];

const Exchange = () => {
  const [fromCoin, setFromCoin] = useState(COINS[2]); // USDT
  const [toCoin, setToCoin] = useState(COINS[5]); // RUB
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [rates, setRates] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFromList, setShowFromList] = useState(false);
  const [showToList, setShowToList] = useState(false);

  useEffect(() => {
    // Получаем курсы к USD и RUB
    const ids = COINS.filter(c => c.id !== 'ruble').map(c => c.id).join(',');
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,rub&include_24hr_change=true`)
      .then(res => res.json())
      .then(data => {
        setRates(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!amount || !rates[fromCoin.id] || !rates[toCoin.id]) {
      setResult('');
      return;
    }
    let res = '';
    if (fromCoin.id === 'ruble') {
      // RUB -> crypto
      const toRub = rates[toCoin.id].rub;
      res = (parseFloat(amount) / toRub).toFixed(4);
    } else if (toCoin.id === 'ruble') {
      // crypto -> RUB
      const fromRub = rates[fromCoin.id].rub;
      res = (parseFloat(amount) * fromRub).toFixed(2);
    } else {
      // crypto -> crypto
      const fromUsd = rates[fromCoin.id].usd;
      const toUsd = rates[toCoin.id].usd;
      res = ((parseFloat(amount) * fromUsd) / toUsd).toFixed(4);
    }
    setResult(res);
  }, [amount, fromCoin, toCoin, rates]);

  const filteredCoins = COINS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="exchange-container">
      <div className="exchange-header">
        <span className="exchange-back-btn-area">
          <button className="exchange-back-btn">
            <IoChevronBackSharp size={28} />
          </button>
        </span>
        <span className="exchange-title">Курс валют</span>
        <span className="exchange-back-btn-area" style={{visibility: 'hidden'}}>
          <IoChevronBackSharp size={28} />
        </span>
      </div>
      <div className="exchange-main-block">
        <div className="exchange-input-row">
          <input
            className="exchange-amount-input"
            type="number"
            placeholder="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <div className="exchange-currency-select" onClick={() => setShowFromList(v => !v)}>
            {fromCoin.icon && <img src={fromCoin.icon} alt="icon" className="exchange-currency-icon-img" />}
            <span className="exchange-currency-label">{fromCoin.symbol}</span>
            <IoChevronDown style={{marginLeft: 6}} />
            {showFromList && (
              <div className="exchange-currency-list">
                {COINS.map(c => (
                  <div key={c.id} className="exchange-currency-list-item" onClick={() => { setFromCoin(c); setShowFromList(false); }}>
                    {c.icon && <img src={c.icon} alt="icon" className="exchange-currency-icon-img" />}
                    <span>{c.name} ({c.symbol})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="exchange-equals">Вы получите</div>
        <div className="exchange-result-row">
          <span className="exchange-result">{result}</span>
          <div className="exchange-currency-select" onClick={() => setShowToList(v => !v)}>
            {toCoin.icon && <img src={toCoin.icon} alt="icon" className="exchange-currency-icon-img" />}
            <span className="exchange-currency-label">{toCoin.symbol}</span>
            <IoChevronDown style={{marginLeft: 6}} />
            {showToList && (
              <div className="exchange-currency-list">
                {COINS.map(c => (
                  <div key={c.id} className="exchange-currency-list-item" onClick={() => { setToCoin(c); setShowToList(false); }}>
                    {c.icon && <img src={c.icon} alt="icon" className="exchange-currency-icon-img" />}
                    <span>{c.name} ({c.symbol})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="exchange-rate-info">
          {fromCoin && toCoin && rates[fromCoin.id] && rates[toCoin.id] && (
            <>
              1 {fromCoin.symbol} ≈ {(() => {
                if (fromCoin.id === 'ruble') {
                  return (1 / rates[toCoin.id].rub).toFixed(4) + ' ' + toCoin.symbol;
                } else if (toCoin.id === 'ruble') {
                  return rates[fromCoin.id].rub.toFixed(2) + ' RUB';
                } else {
                  return (rates[fromCoin.id].usd / rates[toCoin.id].usd).toFixed(4) + ' ' + toCoin.symbol;
                }
              })()}
              <br />
              <span className="exchange-rate-change">
                {rates[fromCoin.id].usd_24h_change > 0 ? '+' : ''}{rates[fromCoin.id].usd_24h_change?.toFixed(2)}% за 24ч
              </span>
            </>
          )}
        </div>
        <button className="exchange-btn" disabled>Обменять</button>
      </div>
      <div className="exchange-courses-label">Курсы валют</div>
      <div className="exchange-search-row">
        <FaSearch className="exchange-search-icon" />
        <input
          className="exchange-search-input"
          placeholder="Введите для поиска..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="exchange-courses-list">
        {loading ? (
          <div className="exchange-loading">Загрузка...</div>
        ) : (
          filteredCoins.filter(c => c.id !== 'ruble').map(c => (
            <div className="exchange-course-item" key={c.id}>
              {c.icon && <img src={c.icon} alt="icon" className="exchange-course-icon-img" />}
              <span className="exchange-course-name">{c.name}</span>
              <span className="exchange-course-value">
                {rates[c.id]?.usd ? `$${rates[c.id].usd}` : '-'}
              </span>
              <span className="exchange-course-change" style={{color: rates[c.id]?.usd_24h_change > 0 ? '#4caf50' : '#ff4d4f'}}>
                {rates[c.id]?.usd_24h_change > 0 ? '+' : ''}{rates[c.id]?.usd_24h_change?.toFixed(2)}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Exchange;