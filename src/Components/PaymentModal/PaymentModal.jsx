import './PaymentModal.css';

const PaymentModal = ({ result, visible, data, onClose }) => {
  if (!visible) return null;

  const { amountRub, amountUsdt } = data;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-logo">
            <span className="logo-icon">DD</span>
            <span>
              <div className="logo-title">PlataPay</div>
              <div className="logo-subtitle">wallet</div>
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
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

        <button className="modal-pay">Оплатить</button>
      </div>
    </div>
  );
};

export default PaymentModal;