import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import TronIcon from './TronIcon';
import './Deposit.css';
// Для генерации QR-кода
import { QRCode } from 'react-qrcode-logo';

const DepositQrScreen = ({ walletAddr, onBack, onCopy }) => {
  return (
    <div className="deposit-bg">
      {/* Header */}
      <div className="deposit-header">
        <button className="deposit-back-btn" onClick={onBack}>
          <FiArrowLeft />
        </button>
        <span className="deposit-title deposit-qr-title">
          <span className="deposit-qr-title-row">
            <span className="deposit-qr-title-icon">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#26a17b"/><path d="M23.5 10.5L16.5 23.5L8.5 8.5L23.5 10.5ZM16.5 21.5L10.5 10.5L21.5 11.5L16.5 21.5ZM16.5 19.5L12.5 12.5L19.5 13.5L16.5 19.5Z" fill="white"/></svg>
            </span>
            Пополнение USDT
          </span>
        </span>
      </div>
      {/* QR-код */}
      <div className="deposit-qr-center">
        <div className="deposit-qr-block">
          <QRCode
            value={walletAddr}
            size={220}
            logoImage="/usdt-tron-logo.png"
            logoWidth={48}
            logoHeight={48}
            logoOpacity={1}
            eyeRadius={8}
            bgColor="#181818"
            fgColor="#fff"
          />
          <div className="deposit-qr-caption">
            Отсканируйте QR-код для отправки<br />активов на ваш кошелек
          </div>
        </div>
      </div>
      {/* Адрес и предупреждение */}
      <div className="deposit-qr-center">
        <div className="deposit-qr-address-block">
          <div className="deposit-qr-address-label">Ваш адрес USDT в сети TRC20</div>
          <div className="deposit-qr-address">{walletAddr}</div>
          <div className="deposit-qr-warning">
            Данный адрес предназначен только для получения USDT в сети TRC20. Отправка других активов приведёт к их безвозвратной потере!
          </div>
        </div>
      </div>
      {/* Кнопки (фиксированные для маленьких экранов) */}
      <div className="deposit-qr-btns-fixed">
        <button className="deposit-network-continue-btn deposit-qr-copy-btn" onClick={() => onCopy(walletAddr)}>Копировать адрес</button>
        <button className="deposit-option-btn deposit-qr-back-btn" onClick={onBack}>Вернуться назад</button>
      </div>
    </div>
  );
};

export default DepositQrScreen; 