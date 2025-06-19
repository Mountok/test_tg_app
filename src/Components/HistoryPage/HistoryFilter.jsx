import React, { useState } from 'react';
import './HistoryFilter.css';

const filterOptions = {
  type: [
    { value: '', label: 'Тип операции' },
    { value: 'deposit', label: 'Пополнение' },
    { value: 'payment', label: 'Оплата' },
  ],
  period: [
    { value: '', label: 'Период' },
    { value: 'day', label: 'День' },
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
  ],
  sum: [
    { value: '', label: 'Сумма' },
    { value: 'asc', label: 'По возрастанию' },
    { value: 'desc', label: 'По убыванию' },
  ],
};

const HistoryFilter = ({ filters, setFilters }) => {
  const [open, setOpen] = useState({ type: false, period: false, sum: false });

  const handleSelect = (filter, value) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
    setOpen(prev => ({ ...prev, [filter]: false }));
  };

  return (
    <div className="history-filter-row">
      {Object.keys(filterOptions).map((filter) => (
        <div
          className={`history-filter-dropdown${open[filter] ? ' open' : ''}`}
          key={filter}
          tabIndex={0}
          onBlur={() => setOpen(prev => ({ ...prev, [filter]: false }))}
        >
          <button
            className="history-filter-btn"
            onClick={() => setOpen(prev => ({ ...prev, [filter]: !prev[filter] }))}
          >
            {filterOptions[filter].find(opt => opt.value === filters[filter])?.label || filterOptions[filter][0].label}
            <span className="history-filter-arrow">▼</span>
          </button>
          <div className="history-filter-list-wrapper">
            <ul className="history-filter-list">
              {filterOptions[filter].map(opt => (
                <li
                  key={opt.value}
                  className={filters[filter] === opt.value ? 'selected' : ''}
                  onMouseDown={() => handleSelect(filter, opt.value)}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryFilter; 