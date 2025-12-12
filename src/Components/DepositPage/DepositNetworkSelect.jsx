import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import TronIcon from './TronIcon';
import { SiBinance } from 'react-icons/si';
import './Deposit.css';

const DepositNetworkSelect = ({ onBack, onContinue }) => {
  const [height, setHeight] = React.useState(window.innerHeight);
  React.useEffect(() => {
    const onResize = () => setHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return (
    <div className="deposit-bg">
      {/* Header */}
      <div className="deposit-header">
        <button className="deposit-back-btn" onClick={onBack}>
          <FiArrowLeft />
        </button>
        <span className="deposit-title">Пополнить</span>
      </div>
      {/* Выбор сети */}
      <div className="deposit-question" style={{ textAlign: 'left', marginLeft: 18, marginBottom: 18 }}>
        Выберите сеть
      </div>
      <div className="deposit-options">
        <div className="deposit-option-btn" style={{ position: 'relative', marginBottom: 18 }}>
          <span style={{ background: '#ff2222', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
            <TronIcon size={26} />
          </span>
          <span className="deposit-option-label">
            <span className="deposit-option-title">TRC20</span><br />
            <span className="deposit-option-desc">Комиссия ??? USDT</span>
          </span>
          <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', border: '3px solid #ffe200', display: 'inline-block' }} />
          </span>
        </div>
        <div className="deposit-soon-label">Скоро</div>
        <div className="deposit-option-disabled">
          <span className="deposit-option-icon-disabled">
            <SiBinance size={26} color="#fff" />
          </span>
          <span className="deposit-option-label">
            <span className="deposit-option-title">BEP-20</span><br />
          </span>
        </div>
      </div>
      <button
        className="deposit-network-continue-btn"
        style={{background:'#FFE500',color:'#222',fontWeight:600,fontSize:height<700?13:16,borderRadius:height<700?9:15,padding:height<700?'8px 0':'13px 0'}} 
        onClick={onContinue}
      >Продолжить</button>
    </div>
  );
};

export default DepositNetworkSelect; 