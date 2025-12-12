// src/Components/OnBoarding/OnBoarding.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateWallet } from '../../utils/wallet.js';
import './Onboarding.css';
import { TelegramInfo, Login, Me } from '../../utils/auth.js';
import { useI18n } from '../../i18n/I18nProvider.jsx';

const localizePages = (t) => ([
  {
    title: t('onboarding.welcomeTitle') || 'Добро пожаловать в PlataPay',
    text: t('onboarding.welcomeText') || 'сервис для оплаты товаров и услуг через криптовалюту',
    buttonText: t('common.next') || 'Далее',
  },
  {
    title: t('onboarding.qrTitle') || 'Сканируйте QR-код СБП',
    text: t('onboarding.qrText') || 'и мы автоматически конвертируем вашу криптовалюту в рубли',
    buttonText: t('common.next') || 'Далее',
  },
  {
    title: t('onboarding.createTitle') || 'Для начала работы нужно создать личный кошелек',
    text: t('onboarding.createText') || 'это займет всего несколько секунд',
    buttonText: t('onboarding.createBtn') || 'Создать',
  },
  {
    title: t('onboarding.readyTitle') || 'Ваш кошелек создан!',
    text: t('onboarding.readyText') || 'Чтобы начать пользоваться сервисом, пополните баланс вашего кошелька USDT. После этого вы сможете сканировать QR-коды СБП и совершать покупки.',
    buttonText: t('onboarding.topUpBtn') || 'Пополнить баланс',
  },
]);

export default function Onboarding({ onFinish }) {
  const { t } = useI18n();
  const pages = localizePages(t);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [walletId, setWalletId] = useState('');
  const navigate = useNavigate();
  const isLast = idx === pages.length - 1;

  const handleNext = async () => {
    // На третьем шаге создаём ПОЛЬЗОВАТЕЛЯ и кошелёк
    if (idx === 2) {
      try {
        setLoading(true);
        const telegramUser = TelegramInfo();
        const { id, username, first_name, last_name } = telegramUser || {};

        if (!id) {
          throw new Error('Не удалось получить данные Telegram');
        }

        await Login(id, username, first_name, last_name);
        await Me(id);
        const wallet = await CreateWallet(id);
        const addr = wallet?.data?.address || '';
        setWalletId(addr);
        
        // 3. ПОСЛЕ успешного создания кошелька проверяем реферальный код
        const pendingRefCode = localStorage.getItem('pending_referral_code');
        if (pendingRefCode && id) {
          try {
            // Импортируем функцию регистрации
            const { registerByReferralCode } = await import('../../utils/referral');
            await registerByReferralCode(pendingRefCode);
            
            // Убираем код из localStorage после успешной регистрации
            localStorage.removeItem('pending_referral_code');
          } catch (refError) {
            console.error('[Onboarding] Ошибка применения реферального кода:', refError);
            // Не показываем ошибку пользователю, так как кошелек уже создан
          }
        } 
      } catch (err) {
        console.error('Ошибка создания пользователя или кошелька:', err);
        alert((t('errors.createWalletFailed') || 'Не удалось создать аккаунт. Попробуйте ещё раз.') + '\n' + (err && err.message ? err.message : String(err)));
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
    switch (idx) {
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
              {loading ? (t('common.pleaseWait') || 'Пожалуйста, подождите...') : pages[idx].buttonText}
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
          {loading ? (t('common.pleaseWait') || 'Пожалуйста, подождите...') : pages[idx].buttonText}
        </button>
      </div>
    </div>
  );
}

