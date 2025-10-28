import { FiChevronRight, FiChevronDown, FiCalendar, FiDollarSign } from 'react-icons/fi';

export default function PaymentDetails({ open, onToggle, amountUsdt, status }) {
  return (
    <div className={`modal-details${open ? ' open' : ''}`}> 
      <button className="modal-details-toggle" onClick={onToggle}>
        <span>Подробности операции</span>
        {open ? <FiChevronDown size={22} /> : <FiChevronRight size={22} />}
      </button>
      <div className="modal-details-content">
        <div className="modal-details-row">
          <span>Дата</span>
          <span className="modal-details-value"><FiCalendar style={{marginRight:4}}/>{new Date().toLocaleString()} </span>
        </div>
        <div className="modal-details-row">
          <span>Сумма</span>
          <span className="modal-details-value"><FiDollarSign style={{marginRight:4}}/>{amountUsdt.toFixed(4)} USDT</span>
        </div>
        {/* <div className="modal-details-row">
          <span>ID транзакции</span>
          <span className="modal-details-value">15487950772104</span>
        </div> */}
        <div className="modal-details-row">
          <span>Получатель</span>
          <span className="modal-details-value">Получатель</span>
        </div>
        <div className="modal-details-row">
          <span>Комиссия</span>
          <span className="modal-details-value">0%</span>
        </div>
        <div className="modal-details-row">
          <span>Статус</span>
          <span className="modal-details-value" style={{color: status==='success' ? '#26a17b' : status==='cancelled' ? '#e14c4c' : undefined}}>
            {status === 'success' ? 'Успешно' : status === 'cancelled' ? 'Оплата отменена' : status === 'in process' ? 'Ожидает оплаты' : '—'}
          </span>
        </div>
      </div>
    </div>
  );
} 