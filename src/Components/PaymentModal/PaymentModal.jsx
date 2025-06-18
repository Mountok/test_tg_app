import { useNavigate } from 'react-router-dom';
import './PaymentModal.css';
import { useEffect, useState } from 'react';
import { CheckOrderStatus, CreateOrder,  } from '../../utils/wallet';
import { FiChevronRight, FiChevronDown, FiCalendar, FiDollarSign } from 'react-icons/fi';
import PaymentDetails from './PaymentDetails';

const PaymentModal = ({ qrLink,telegramID, result, visible, data, onClose }) => {
  if (!visible) return null;
  const [paymentState, setPaymentState] = useState("idle")
  const [orderID, setOrderID] = useState(null)
  const { amountRub, amountUsdt } = data;
  const [detailsOpen, setDetailsOpen] = useState(false);

// после того как orderID установился, запускаем опрос статуса
  useEffect(() => {
    if (!orderID) return;

    setPaymentState('in process');
    const interval = setInterval(async () => {
      try {
        const resp = await CheckOrderStatus(orderID,telegramID);
        console.log('Проверка статуса заказа:', resp.data);
        // если платёж завершён
        if (resp.data === true) {
          setPaymentState('success');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Ошибка при проверке статуса заказа:', err);
      }
    }, 3500);

    // при демонтировании — очищаем
    return () => clearInterval(interval);
  }, [orderID]);


  const handleButton = (e) => {
    e.preventDefault()
    // alert(qrLink)

    console.log({
      telegramID: telegramID ? telegramID : 0,
      summa: amountRub,
      qrlink : qrLink,
    })

    CreateOrder(telegramID,amountRub, qrLink).then((resp) => {
      console.log(resp)
      setOrderID(resp.order_id);
    }).catch(err => {
      console.error(err)
      // setPaymentState("idle")
    })
  }



  return (
    <div className="modal-backdrop">
      {paymentState === 'success' ? (
        <div className="modal-success-fullscreen">
          <div className="modal-success-header">
            <button className="modal-success-back" onClick={onClose} aria-label="Назад">&#8592;</button>
            <span className="modal-success-title">Информация о платеже</span>
          </div>
          <div className="modal-success-content">
            <div className="modal-success-checkmark">
              <div className="modal-success-circle">
                <span className="modal-success-check">&#10003;</span>
              </div>
            </div>
            <div className="modal-success-text">Оплата успешно проведена!</div>
            <div className="modal-success-amount">{amountUsdt.toFixed(4)} USDT</div>
            <PaymentDetails open={detailsOpen} onToggle={() => setDetailsOpen(o => !o)} amountUsdt={amountUsdt} />
          </div>
          <button className="modal-success-btn" onClick={onClose}>Вернуться назад</button>
        </div>
      ) : (
        <div className="modal-container">
          <div className="modal-header">
            <div className="modal-logo">
              <span className="logo-icon">DD</span>
              <span>
                <div className="logo-title">PlataPay</div>
                <div className="logo-subtitle">wallet</div>
              </span>
            </div>
            {paymentState == "in process" ? (null) : (<button className="modal-close" onClick={onClose}>×</button>)}
          </div>
          <div className="modal-box dark">
            <div className="modal-label">Сумма</div>
            <div className="modal-value">{amountRub} RUB</div>
            <div className="modal-subtext">Курс обмена</div>
            <div className="modal-rate">USDT → RUB</div>
          </div>
          <div className="modal-box light">
            <div className="modal-token">
              <div className="token-icon">T</div>
              <div>
                <div className="token-name">USDT</div>
                <div className="token-balance">{amountUsdt.toFixed(4)} USDT</div>
              </div>
            </div>
          </div>
          <div className="modal-summary">
            <div>
              <div className="summary-label">Итого:</div>
              <div className="summary-subtext">Комиссия x%</div>
            </div>
            <div className="summary-amount">{amountUsdt.toFixed(4)} USDT</div>
          </div>
          {paymentState == "in process" ? <button className="modal-pay process">Обработка платежа</button>
            : paymentState == "idle"  ? <button className="modal-pay" onClick={(e) => handleButton(e)}>Оплатить</button> : null
          }
        </div>
      )}
    </div>
  );
};

export default PaymentModal;