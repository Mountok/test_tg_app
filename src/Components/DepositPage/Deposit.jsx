import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCreditCard, FiUsers } from 'react-icons/fi';
import { BsWallet2 } from 'react-icons/bs';
import DepositNetworkSelect from './DepositNetworkSelect';
import DepositQrScreen from './DepositQrScreen';
import './Deposit.css';
import { GetWallet } from '../../utils/wallet';
import { json } from '@tma.js/sdk';

const TEST_WALLET_ADDR = 'TQjVtuc1CeL7WEe7hHF7XZMWi6J89JgxQW';

const Deposit = ({telegramID}) => {
  const [step, setStep] = useState(0); // 0 - способ, 1 - сеть, 2 - QR
  const [anim, setAnim] = useState(false);
  const [walletAddr, SetWalletAddr] = useState(TEST_WALLET_ADDR);
  const navigate = useNavigate();

  useEffect(() => {
    getWalletByTgId(telegramID)
  },[])
  const getWalletByTgId = async (telegramID) => {
    try {
      const walletRes = await GetWallet(telegramID);
      const addr = walletRes.data.address;  // сразу берём из ответа
      SetWalletAddr(addr);
      console.log(addr)
    } catch (error) {
      console.log(error)
      alert(JSON.stringify(error))
    }
  }

  // Анимация свайпа влево
  const goToNetwork = () => {
    setAnim(true);
    setTimeout(() => {
      setStep(1);
      setAnim(false);
    }, 250);
  };
  const goToQr = () => {
    setAnim(true);
    setTimeout(() => {
      setStep(2);
      setAnim(false);
    }, 250);
  };
  const goBack = () => {
    setAnim(true);
    setTimeout(() => {
      setStep(step - 1);
      setAnim(false);
    }, 250);
  };
  const handleCopy = (addr) => {
    navigator.clipboard.writeText(addr);
  };
  const handleBackToRoot = () => {
    navigate('/');
  };

  return (
    <div className="deposit-bg" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Шаг 1: выбор способа */}
      <div className={`deposit-step${step === 0 ? ' active' : ''}${anim && step === 0 ? ' swipe-left' : ''}`} style={{ position: 'absolute', width: '100%', top: 0, left: 0, transition: 'transform 0.25s cubic-bezier(.4,0,.2,1)', zIndex: step === 0 ? 2 : 1, transform: step === 0 && anim ? 'translateX(-100vw)' : 'translateX(0)' }}>
        <div className="deposit-header">
          <button className="deposit-back-btn" onClick={handleBackToRoot}>
            <FiArrowLeft />
          </button>
          <span className="deposit-title">Пополнить</span>
        </div>
        <div className="deposit-question">
          Каким способом вы хотите<br />купить криптовалюту
        </div>
        <div className="deposit-options">
          <button className="deposit-option-btn" onClick={goToNetwork}>
            <span className="deposit-option-icon">
              <BsWallet2 size={22} color="#000" />
            </span>
            <span className="deposit-option-label">
              <span className="deposit-option-title">Внешний кошелек</span><br />
              <span className="deposit-option-desc">Перевод с другого кошелька</span>
            </span>
            <span className="deposit-option-arrow">&#8250;</span>
          </button>
          <div className="deposit-soon-label">Скоро</div>
          <div className="deposit-option-disabled">
            <span className="deposit-option-icon-disabled">
              <FiCreditCard size={22} color="#fff" />
            </span>
            <span className="deposit-option-label">
              <span className="deposit-option-title">Банковская карта</span><br />
              <span className="deposit-option-desc">Покупка криптовалюты по карте</span>
            </span>
          </div>
          <div className="deposit-option-disabled">
            <span className="deposit-option-icon-disabled">
              <FiUsers size={22} color="#fff" />
            </span>
            <span className="deposit-option-label">
              <span className="deposit-option-title">P2P маркет</span><br />
              <span className="deposit-option-desc">Покупка без посредников</span>
            </span>
          </div>
        </div>
      </div>
      {/* Шаг 2: выбор сети */}
      <div className={`deposit-step${step === 1 ? ' active' : ''}${anim && step === 1 ? (step < 2 ? ' swipe-right' : ' swipe-left') : ''}`} style={{ position: 'absolute', width: '100%', top: 0, left: 0, transition: 'transform 0.25s cubic-bezier(.4,0,.2,1)', zIndex: step === 1 ? 2 : 1, transform: anim ? (step < 2 ? 'translateX(100vw)' : 'translateX(-100vw)') : 'translateX(0)' }}>
        {step === 1 && <DepositNetworkSelect onBack={goBack} onContinue={goToQr} />}
      </div>
      {/* Шаг 3: QR-код */}
      <div className={`deposit-step${step === 2 ? ' active' : ''}${anim && step === 2 ? ' swipe-right' : ''}`} style={{ position: 'absolute', width: '100%', top: 0, left: 0, transition: 'transform 0.25s cubic-bezier(.4,0,.2,1)', zIndex: step === 2 ? 2 : 1, transform: step === 2 && anim ? 'translateX(100vw)' : 'translateX(0)' }}>
        {step === 2 && <DepositQrScreen walletAddr={walletAddr} onBack={goBack} onCopy={handleCopy} />}
      </div>
    </div>
  );
};

export default Deposit;