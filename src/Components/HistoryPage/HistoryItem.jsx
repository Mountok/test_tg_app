import React from 'react';
import './HistoryItem.css';

const HistoryItem = ({ type, amount, direction, category, date }) => {
  // type: 'deposit' | 'payment'
  // direction: 'in' | 'out'
  // amount: число
  // category: строка
  // date: строка или объект Date

  // Цвет суммы и знак
  const isPositive = direction === 'in';
  const amountClass = isPositive ? 'history-item-amount positive' : 'history-item-amount negative';
  const sign = isPositive ? '+' : '-';

  // Иконка (можно заменить на svg или картинку)
  const icon = isPositive ? (
    <span className="history-item-icon in">&#8592;</span>
  ) : (
    <span className="history-item-icon out">&#8599;</span>
  );

  return (
    <div className="history-item fade-in">
      <div className="history-item-avatar">{icon}</div>
      <div className="history-item-info">
        <div className="history-item-title">{type === 'deposit' ? 'Пополнение' : 'Оплата в магазине'}</div>
        <div className="history-item-category">#{category || 'Категория'}</div>
      </div>
      <div className={amountClass}>{sign}{Math.abs(amount).toFixed(4)} USDT</div>
    </div>
  );
};

export default HistoryItem; 