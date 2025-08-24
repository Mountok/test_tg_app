import React, { useMemo, useState } from 'react';
import './HistoryFilter.css';
import { useI18n } from '../../i18n/I18nProvider.jsx';

const buildFilterOptions = (t) => ({
  type: [
    { value: '', label: t('history.filter.type') || 'Тип операции' },
    { value: 'deposit', label: t('history.filter.deposit') || 'Пополнение' },
    { value: 'payment', label: t('history.filter.payment') || 'Оплата' },
  ],
  period: [
    { value: '', label: t('history.filter.period') || 'Период' },
    { value: 'day', label: t('history.filter.day') || 'День' },
    { value: 'week', label: t('history.filter.week') || 'Неделя' },
    { value: 'month', label: t('history.filter.month') || 'Месяц' },
  ],
  sum: [
    { value: '', label: t('history.filter.sum') || 'Сумма' },
    { value: 'asc', label: t('history.filter.sumAsc') || 'По возрастанию' },
    { value: 'desc', label: t('history.filter.sumDesc') || 'По убыванию' },
  ],
});

const HistoryFilter = ({ filters, setFilters }) => {
  const [open, setOpen] = useState({ type: false, period: false, sum: false });
  const { t } = useI18n();
  const filterOptions = useMemo(() => buildFilterOptions(t), [t]);

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