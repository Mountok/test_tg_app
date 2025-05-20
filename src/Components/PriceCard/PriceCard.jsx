// src/components/PriceCard/PriceCard.jsx
import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { fetchMarketChart } from '../../utils/coinGecko';
import './PriceCard.css';

export default function PriceCard({ coinId, title, symbol, color }) {
  const [data, setData] = useState([]);
  const [change, setChange] = useState(0);
  const [current, setCurrent] = useState(0);

  const load = async () => {
    const chart = await fetchMarketChart(coinId, 60);
    setData(chart);
    if (chart.length) {
      const first = chart[0].price;
      const last  = chart[chart.length - 1].price;
      setCurrent(last);
      setChange(((last - first) / first) * 100);
    }
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 60_000);
    return () => clearInterval(iv);
  }, [coinId]);

  return (
    <div className="price-card">
      <div className="price-card-header">
        <h3>{title}</h3>
        <span 
          className={`price-card-change ${change >= 0 ? 'up' : 'down'}`}
        >
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>

      <div className="price-card-chart">
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={data}>
            <CartesianGrid stroke="transparent" />
            <XAxis 
              dataKey="time" 
              tick={false} 
              axisLine={false} 
              domain={['auto','auto']}
            />
            <YAxis 
              dataKey="price" 
              tick={false} 
              axisLine={false} 
              domain={['auto','auto']}
            />
            <Tooltip 
              formatter={(value) => `$${value.toFixed(2)}`} 
              labelFormatter={ts => new Date(ts).toLocaleTimeString()} 
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={color} 
              dot={false} 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="price-card-footer">
        <span className="price-card-symbol">{symbol.toUpperCase()}</span>
        <span className="price-card-current">${current.toLocaleString()}</span>
      </div>
    </div>
  );
}
