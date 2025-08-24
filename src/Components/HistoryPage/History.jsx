import React, { useEffect, useState } from 'react'
import { GetOrdersByTelegramId } from '../../utils/wallet'
import HistoryItem from './HistoryItem'
import HistoryFilter from './HistoryFilter'
import './History.css'
import { useI18n } from '../../i18n/I18nProvider.jsx'

const History = ({ telegramID }) => {
  // {
  //   crypto: 12.7372
  //   id: 2
  //   is_paid: true
  //   qr_code: "https://qr.nspk.ru/AD20005I58HUHKK29OQBMPMMCJCJQO90?type=02&bank=100000000014&sum=100000&cur=RUB&crc=B2D4"
  //   summa: 1000
  //   telegram_id: 0
  // }
  const [orders, setOrders] = useState([])
  const { t } = useI18n()
  const [filters, setFilters] = useState({ type: '', period: '', sum: '' })

  useEffect(() => {
    GetOrdersByTelegramId(telegramID).then((resp) => {
      if (Array.isArray(resp)) {
        setOrders(resp) 
      } else if (resp && Array.isArray(resp.data)) {
        setOrders(resp.data)
      } else {
        setOrders([])
      }
    }).catch(err => {
      alert(err)
      setOrders([])
    })
  }, [telegramID])

  // Фильтрация
  const filteredOrders = Array.isArray(orders) ? orders
    .filter(order => {
      if (filters.type === 'deposit' && order.is_paid) return false; // пополнение — is_paid === false
      if (filters.type === 'payment' && !order.is_paid) return false; // оплата — is_paid === true
      // Период фильтрация (заглушка, реализовать по дате)
      return true
    })
    .sort((a, b) => {
      if (filters.sum === 'asc') return a.crypto - b.crypto
      if (filters.sum === 'desc') return b.crypto - a.crypto
      return 0
    }) : []

  return (
    <div className="history">
      <div className="history-header">
        <div className="history-header_back">

        </div>
        <div className="history-header_title">
          <p>{t('history.title') || 'История операций'}</p>
        </div>
      </div>
      <HistoryFilter filters={filters} setFilters={setFilters} />
      <div className="history-list">
        {filteredOrders.length === 0 && <div className="history-empty">{t('history.empty') || 'Нет операций'}</div>}
        {filteredOrders.map((order, idx) => (
          <HistoryItem
            key={order.id || idx}
            type={order.is_paid ? 'payment' : 'deposit'}
            amount={order.crypto}
            direction={order.is_paid ? 'out' : 'in'}
            category={order.category}
            date={order.date}
          />
        ))}
      </div>
    </div>
  )
}

export default History