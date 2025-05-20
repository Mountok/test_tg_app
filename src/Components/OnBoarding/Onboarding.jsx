// src/Components/OnBoarding/OnBoarding.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateWallet } from '../../utils/wallet.js';
import './Onboarding.css';

const pages = [
  {
    title: 'Добро пожаловать в PlataPay',
    text: 'сервис для оплаты товаров и услуг через криптовалюту',
    buttonText: 'Далее',
  },
  {
    title: 'Сканируйте QR-код СБП',
    text: 'и мы автоматически конвертируем вашу криптовалюту в рубли',
    buttonText: 'Далее',
  },
  {
    title: 'Для начала работы нужно создать личный кошелек',
    text: 'это займет всего несколько секунд',
    buttonText: 'Создать',
  },
  {
    title: 'Ваш кошелек создан!',
    text: 'Чтобы начать пользоваться сервисом, пополните баланс вашего кошелька USDT. После этого вы сможете сканировать QR-коды СБП и совершать покупки.',
    buttonText: 'Пополнить баланс',
  },
];

export default function Onboarding({ telegramID, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [walletId, setWalletId] = useState('');
  const navigate = useNavigate();
  const isLast = idx === pages.length - 1;

  const handleNext = async () => {
    // На третьем шаге создаём кошелёк
    if (idx === 2) {
      try {
        setLoading(true);
        const wallet = await CreateWallet(telegramID);
        setWalletId(wallet?.address || 'TOjVuc1CeL7WEe7hHF7XZMWi6J89JgxQW');
      } catch (err) {
        console.error('Ошибка создания кошелька:', err);
        alert('Не удалось создать кошелёк. Попробуйте ещё раз.');
        return;
      } finally {
        setLoading(false);
      }
    }

    if (isLast) {
      // Завершили онбординг
      localStorage.setItem('onboardDone', 'true');
      onFinish();
      navigate('/');
    } else {
      setIdx(idx + 1);
    }
  };

  const renderContent = () => {
    switch(idx) {
      case 0:
        return (
          <div className="onboarding-slide logo-slide">
            <div className="logo-container">
              <img src="/images/logo.png" alt="PlataPay Logo" className="logo" />
            </div>
            <div className="onboarding-content">
              <h1>{pages[idx].title}</h1>
              <p>{pages[idx].text}</p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="onboarding-slide qr-slide">
            <div className="qr-container">
              <img src="/images/qr-code.png" alt="QR Code" className="qr-code" />
            </div>
            <div className="onboarding-content">
              <h1>{pages[idx].title}</h1>
              <p>{pages[idx].text}</p>
            </div>
            <div className="onboarding-footer">
              {renderPagination()}
              <button
                className="btn-next"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? 'Пожалуйста, подождите...' : pages[idx].buttonText}
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="onboarding-slide">
            <div className="onboarding-content">
              <h1>{pages[idx].title}</h1>
              <p>{pages[idx].text}</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="onboarding-slide wallet-slide">
            <div className="wallet-id-container">
              <div className="wallet-id">{walletId}</div>
            </div>
            <div className="onboarding-content">
              <h1>{pages[idx].title}</h1>
              <p>{pages[idx].text}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Pagination indicators
  const renderPagination = () => {
    return (
      <div className="pagination">
        {pages.map((_, i) => (
          <div 
            key={i} 
            className={`pagination-dot ${i === idx ? 'active' : ''}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="onboarding">
      {renderContent()}
      <div className="onboarding-footer">
        {renderPagination()}
        <button
          className="btn-next"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? 'Пожалуйста, подождите...' : pages[idx].buttonText}
        </button>
      </div>
    </div>
  );
}
