import { useNavigate } from 'react-router-dom';
import './PaymentModal.css';
import { useEffect, useState } from 'react';
import { CheckOrderStatus, CreateOrder, GetBalanceUSDT, GetWallet, } from '../../utils/wallet';
import { FiChevronRight, FiChevronDown, FiCalendar, FiDollarSign } from 'react-icons/fi';
import PaymentDetails from './PaymentDetails';
import { useI18n } from '../../i18n/I18nProvider.jsx';

const PaymentModal = ({ qrLink, telegramID, result, visible, data, onClose }) => {
  if (!visible) return null;
  const { t } = useI18n();
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
        const resp = await CheckOrderStatus(orderID);
        // resp: { paid, cancelled, status }
        if (resp.paid) {
          setPaymentState('success');
          clearInterval(interval);
        } else if (resp.cancelled) {
          setPaymentState('cancelled');
          clearInterval(interval);
        } else if (resp.status === 'pending') {
          setPaymentState('in process');
        } else {
          setPaymentState('idle');
        }
      } catch (err) {
        console.error('Ошибка при проверке статуса заказа:', err);
      }
    }, 3500);

    // при демонтировании — очищаем
    return () => clearInterval(interval);
  }, [orderID]);


  const handleButton =  async (e) => {
    e.preventDefault()
    if (paymentState === "in process") return; // защита от повторных нажатий
    setPaymentState("in process");
    // alert(qrLink)
    var balanceControl = false

    console.log("handleButton -получение адреса кошелька")
    const walletRes = await GetWallet(telegramID);
    const addr = walletRes.data.address;  // сразу берём из ответа
    console.log("handleButton -адрес кошелька:", addr)
    
    console.log("handleButton -получение баланса USDT")
    await GetBalanceUSDT(telegramID, addr).then((res) => {
      if (res.available_balance_plus_v > amountUsdt) {
        balanceControl = true
      } else {
        setPaymentState("cancel")

      }
    }).catch((err) => {
      console.log(err)
    })

    console.log("handleButton -проверка баланса USDT:", balanceControl)
    if (!balanceControl) {return}

    console.log({
      telegramID: telegramID ? telegramID : 0,
      summa: amountRub,
      crypto: Number(amountUsdt.toFixed(4)),
      qrlink: qrLink,
    })

    console.log("handleButton -создание заказа")
    await CreateOrder(telegramID, amountRub, qrLink, Number(amountUsdt.toFixed(4))).then((resp) => {
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
            <button className="modal-success-back" onClick={onClose} aria-label={t('common.back') || 'Назад'}>&#8592;</button>
            <span className="modal-success-title">{t('payment.info') || 'Информация о платеже'}</span>
          </div>
          <div className="modal-success-content">
            <div className="modal-success-checkmark">
              <div className="modal-success-circle">
                <span className="modal-success-check">&#10003;</span>
              </div>
            </div>
            <div className="modal-success-text">{t('payment.success') || 'Оплата успешно проведена!'}</div>
            <div className="modal-success-amount">{amountUsdt.toFixed(4)} USDT</div>
            <PaymentDetails open={detailsOpen} onToggle={() => setDetailsOpen(o => !o)} amountUsdt={amountUsdt} status={paymentState} />
          </div>
          <button className="modal-success-btn" onClick={onClose}>{t('common.back') || 'Вернуться назад'}</button>
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
            {paymentState == "in process" ? (null) : (<button className="modal-close" onClick={onClose} aria-label={t('common.close') || 'Закрыть'}>×</button>)}
          </div>
          <div className="modal-box dark">
            <div className="modal-label">{t('payment.amount') || 'Сумма'}</div>
            <div className="modal-value">{amountRub} RUB</div>
            <div className="modal-subtext">{t('payment.rate') || 'Курс обмена'}</div>
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
              <div className="summary-label">{t('payment.total') || 'Итого:'}</div>
              <div className="summary-subtext">{t('payment.fee') || 'Комиссия 0%'}</div>
            </div>
            <div className="summary-amount">{amountUsdt.toFixed(4)} USDT</div>
          </div>
          {paymentState === "in process" ? (
            <button className="modal-pay process">{t('payment.processing') || 'Обработка платежа'}</button>
          ) : paymentState === "idle" ? (
            <button className="modal-pay" onClick={handleButton} disabled={paymentState === "in process"}>{t('payment.pay') || 'Оплатить'}</button>
          ) : paymentState === "cancel" ? (
            <button className="modal-pay cancel shake-once">{t('payment.noBalance') || 'Недостаточно баланса'}</button>
          ) : paymentState === "cancelled" ? (
            <button className="modal-pay cancel shake-once">Оплата отменена</button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default PaymentModal;