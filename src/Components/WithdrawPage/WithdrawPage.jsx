import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';
import { LuUpload } from 'react-icons/lu';
import './WithdrawPage.css';
import { useI18n } from '../../i18n/I18nProvider.jsx';
import { GetBalanceUSDT, GetWallet, SendWithdrawRequest } from '../../utils/wallet';
import { TelegramInfo } from '../../utils/auth';

const WithdrawPage = ({ telegramID }) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  
  // Состояния формы
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [walletAddr, setWalletAddr] = useState('');
  
  // Состояния валидации
  const [addressValid, setAddressValid] = useState(null);
  const [amountValid, setAmountValid] = useState(null);
  const [addressError, setAddressError] = useState('');
  const [amountError, setAmountError] = useState('');
  
  // Состояния UI
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0); // 0 - форма, 1 - подтверждение, 2 - обработка, 3 - результат
  const [progress, setProgress] = useState(0); // Прогресс обработки
  
  // Константы
  const MIN_WITHDRAWAL = 10.0;
  const SYSTEM_COMMISSION = 5.0;
  
  // Загрузка баланса при инициализации
  useEffect(() => {
    loadUserBalance();

  }, [telegramID]);
  
  const loadUserBalance = async () => {
    try {
      setLoading(true);
      
      // Получаем telegram_id из Telegram WebApp
      const getTelegramId = () => {
        // Из Telegram WebApp
        if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
          return window.Telegram.WebApp.initDataUnsafe.user.id;
        }
        // Fallback из переданного параметра
        return telegramID;
      };
      
      const currentTelegramId = getTelegramId();
      console.log('[WithdrawPage] Используем Telegram ID:', currentTelegramId);
      
      const walletRes = await GetWallet(currentTelegramId);
      const addr = walletRes.data.address;
      setWalletAddr(addr);
      
      const balanceRes = await GetBalanceUSDT(currentTelegramId, addr);
      setBalance(balanceRes.available_balance_plus_v || 0);
    } catch (error) {
      console.error('Ошибка загрузки баланса:', error);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };
  
  // Валидация TRON адреса
  const validateTronAddress = (addr) => {
    if (!addr) {
      setAddressError('Введите адрес получателя');
      setAddressValid(false);
      return false;
    }
    
    if (!addr.startsWith('T')) {
      setAddressError('TRON адрес должен начинаться с "T"');
      setAddressValid(false);
      return false;
    }
    
    if (addr.length !== 34) {
      setAddressError('TRON адрес должен содержать 34 символа');
      setAddressValid(false);
      return false;
    }
    
    // Проверка на валидные символы Base58
    const base58Pattern = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;
    if (!base58Pattern.test(addr)) {
      setAddressError('Неверный формат TRON адреса');
      setAddressValid(false);
      return false;
    }
    
    // Проверка что это не наш собственный адрес
    if (addr === walletAddr) {
      setAddressError('Нельзя выводить на собственный адрес');
      setAddressValid(false);
      return false;
    }
    
    setAddressError('');
    setAddressValid(true);
    return true;
  };
  
  // Валидация суммы
  const validateAmount = (amt) => {
    const numAmount = parseFloat(amt);
    
    if (!amt || isNaN(numAmount)) {
      setAmountError('Введите сумму вывода');
      setAmountValid(false);
      return false;
    }
    
    if (numAmount < MIN_WITHDRAWAL) {
      setAmountError(`Минимальная сумма: ${MIN_WITHDRAWAL.toFixed(2)} USDT`);
      setAmountValid(false);
      return false;
    }
    
    if (numAmount > balance) {
      setAmountError('Недостаточно средств на балансе');
      setAmountValid(false);
      return false;
    }
    
    const userReceives = numAmount - SYSTEM_COMMISSION;
    if (userReceives <= 0) {
      setAmountError('Сумма слишком мала после вычета комиссии');
      setAmountValid(false);
      return false;
    }
    
    setAmountError('');
    setAmountValid(true);
    return true;
  };
  
  // Обработчики изменения полей
  const handleAddressChange = (e) => {
    const value = e.target.value.trim();
    setAddress(value);
    if (value) {
      validateTronAddress(value);
    } else {
      setAddressValid(null);
      setAddressError('');
    }
  };
  
  const handleAmountChange = (e) => {
    let value = e.target.value;
    
    // Разрешаем только цифры и одну точку
    value = value.replace(/[^0-9.]/g, '');
    
    // Разрешаем только одну точку
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1];
    }
    
    // Ограничиваем до 2 знаков после запятой
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    setAmount(value);
    if (value) {
      validateAmount(value);
    } else {
      setAmountValid(null);
      setAmountError('');
    }
  };
  
  // Расчет сумм
  const calculateAmounts = () => {
    const requestedAmount = parseFloat(amount) || 0;
    const userReceives = Math.max(0, requestedAmount - SYSTEM_COMMISSION);
    
    return {
      requested: requestedAmount,
      commission: SYSTEM_COMMISSION,
      userReceives: userReceives
    };
  };
  
  // Обработчик отправки формы
  const handleSubmit = () => {
    if (!validateTronAddress(address) || !validateAmount(amount)) {
      return;
    }
    
    setStep(1); // Переход к подтверждению
  };
  
  // Подтверждение вывода
  const confirmWithdraw = async () => {
    try {
      setStep(2); // Переход к обработке
      setProcessing(true);
      setProgress(0); // Сброс прогресса
      
      // Получаем telegram_id (как в loadUserBalance)
      const getTelegramId = () => {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
          return window.Telegram.WebApp.initDataUnsafe.user.id;
        }
        return telegramID;
      };
      
      const currentTelegramId = getTelegramId();
      console.log('[WithdrawPage] Вывод для Telegram ID:', currentTelegramId);
      
      // Вызов нового API для отправки запроса на вывод средств
      const result = await SendWithdrawRequest(
        currentTelegramId,
        walletAddr, // from_address - адрес кошелька пользователя
        address,    // to_address - адрес получателя
        parseFloat(amount)
      );
     
      
      console.log('[WithdrawPage] Результат вывода:', result);
      
      setProgress(100); // Завершение прогресса
      setTimeout(() => {
        setStep(3); // Переход к результату
        setProcessing(false);
      }, 1000); // Небольшая задержка для показа завершения
      
    } catch (error) {
      console.error('Ошибка вывода средств:', error);
      setProcessing(false);
      setProgress(0);
      setStep(0); // Возврат к форме
      alert(error.message || 'Ошибка при выводе средств. Попробуйте еще раз.');
    }
  };
  
  const { requested, commission, userReceives } = calculateAmounts();
  
  // Рендер формы вывода
  const renderWithdrawForm = () => (
    <div className="withdraw-form">
      <div className="withdraw-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FiArrowLeft />
        </button>
        <h1 className="withdraw-title">{t('withdraw.title') || 'Вывод USDT'}</h1>
        <div></div>
      </div>
      
      <div className="withdraw-balance">
        <div className="balance-card">
          <p className="balance-label">{t('withdraw.availableBalance') || 'Доступный баланс'}</p>
          <p className="balance-amount">{balance.toFixed(2)} USDT</p>
        </div>
      </div>
      
      <div className="withdraw-fields">
        {/* Адрес получателя */}
        <div className="field-group">
          <label className="field-label"> {t('withdraw.recipientAddress') || 'Адрес получателя'}</label>
          <div className={`field-input-wrapper ${addressValid === true ? 'valid' : addressValid === false ? 'invalid' : ''}`}>
            <input
              type="text"
              className="field-input"
              placeholder="TXxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={address}
              onChange={handleAddressChange}
            />
            {addressValid === true && <BsCheckCircle className="validation-icon valid" />}
            {addressValid === false && <BsXCircle className="validation-icon invalid" />}
          </div>
          {addressValid === true && <p className="validation-message valid">Валидный TRON адрес</p>}
          {addressError && <p className="validation-message invalid"> {addressError}</p>}
        </div>
        
        {/* Сумма вывода */}
        <div className="field-group">
          <label className="field-label"> {t('withdraw.amount') || 'Сумма вывода'}</label>
          <div className={`field-input-wrapper ${amountValid === true ? 'valid' : amountValid === false ? 'invalid' : ''}`}>
            <input
              type="text"
              className="field-input"
              placeholder="50.00"
              value={amount}
              onChange={handleAmountChange}
            />
            <span className="field-currency">USDT</span>
          </div>
          <p className="field-hint">Коммисия: {SYSTEM_COMMISSION.toFixed(2)} USDT</p>
          <p className="field-hint">Минимальный вывод: {MIN_WITHDRAWAL.toFixed(2)} USDT</p>
          {amountError && <p className="validation-message invalid">❌ {amountError}</p>}
        </div>
      </div>
      
      {/* Расчет */}
      {amount && parseFloat(amount) >= MIN_WITHDRAWAL && (
        <div className="withdraw-calculation">
          <div className="calculation-row">
            <span>Сумма к выводу:</span>
            <span>{requested.toFixed(2)} USDT</span>
          </div>
          <div className="calculation-row">
            <span>Комиссия системы:</span>
            <span>-{commission.toFixed(2)} USDT</span>
          </div>

          <div className="calculation-divider"></div>
          <div className="calculation-row total">
            <span>Вы получите:</span>
            <span>{userReceives.toFixed(2)} USDT</span>
          </div>
        </div>
      )}
      
      <div className="withdraw-actions">
        <button 
          className={`withdraw-btn ${addressValid && amountValid ? 'enabled' : 'disabled'}`}
          onClick={handleSubmit}
          disabled={!addressValid || !amountValid || loading}
        >
          {loading ? '🔄 Обработка...' : '🚀 ' + (t('withdraw.submit') || 'Вывести средства')}
        </button>
        <p className="withdraw-info">
        ]{t('withdraw.processingTime') || 'Запрос будет обработан в течение 5 минут'}
        </p>
      </div>
    </div>
  );
  
  // Рендер подтверждения
  const renderConfirmation = () => (
    <div className="withdraw-confirmation">
      <div className="confirm-header">
        <button className="back-btn" onClick={() => setStep(0)}>
          <FiArrowLeft />
        </button>
        <h1 className="confirm-title">✅ Подтверждение вывода</h1>
        <div></div>
      </div>
      
      <div className="confirm-details">
        <div className="confirm-section">
          <h3>📍 Адрес получателя:</h3>
          <p className="confirm-address">{address}</p>
        </div>
        
        <div className="confirm-section">
          <h3>💰 Детали операции:</h3>
          <div className="confirm-calculation">
            <div className="confirm-row">
              <span>Сумма к выводу:</span>
              <span>{requested.toFixed(2)} USDT</span>
            </div>
            <div className="confirm-row">
              <span>Комиссия системы:</span>
              <span>-{commission.toFixed(2)} USDT</span>
            </div>
            <div className="confirm-divider"></div>
            <div className="confirm-row total">
              <span>Вы получите:</span>
              <span>{userReceives.toFixed(2)} USDT</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="confirm-actions">
        <button className="confirm-btn" onClick={confirmWithdraw}>
          🚀 Подтвердить вывод
        </button>
        <button className="cancel-btn" onClick={() => setStep(0)}>
          ❌ Отмена
        </button>
      </div>
    </div>
  );
  
  // Определяем текущий шаг на основе прогресса (функция)
  const getProgressStep = (progress) => {
    if (progress < 25) return { text: "🔄 Проверяем данные...", bars: "████░░░░░░", percent: Math.round(progress) };
    if (progress < 50) return { text: "🔄 Подготавливаем запрос...", bars: "██████░░░░", percent: Math.round(progress) };
    if (progress < 80) return { text: "🔄 Отправляем запрос на сервер...", bars: "████████░░", percent: Math.round(progress) };
    if (progress < 100) return { text: "🔄 Обрабатываем запрос...", bars: "██████████", percent: Math.round(progress) };
    return { text: "✅ Запрос отправлен!", bars: "██████████", percent: 100 };
  };

  // useEffect для анимации прогресса
  useEffect(() => {
    if (step === 2 && processing) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + Math.random() * 15;
        });
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [step, processing]);
  
  // Рендер процесса обработки с правильным прогрессом
  const renderProcessing = () => {
    const currentStep = getProgressStep(progress);
    
    return (
      <div className="withdraw-processing">
        <div className="processing-header">
          <h1 className="processing-title">🔄 Отправляем запрос</h1>
        </div>
        
        <div className="processing-progress">
          <div className="progress-step">
            <div className="progress-text">{currentStep.text}</div>
            <div className="progress-bars">{currentStep.bars} {currentStep.percent}%</div>
          </div>
        </div>
        
        <div className="processing-info">
          <p>Запрос на вывод отправлен</p>
          <p>Транзакция будет обработана в течение 5 минут</p>
        </div>
      </div>
    );
  };
  
  // Рендер результата
  const renderResult = () => (
    <div className="withdraw-result">
      <div className="result-header">
        <h1 className="result-title">✅ Запрос принят!</h1>
      </div>
      
      <div className="result-details">
        <div className="result-icon">⏳</div>
        <p className="result-message">
          Запрос на вывод средств успешно отправлен. Транзакция будет обработана в течение 5 минут.
        </p>
        
        <div className="result-summary">
          <div className="summary-row">
            <span>Переведено:</span>
            <span>{userReceives.toFixed(2)} USDT</span>
          </div>
          <div className="summary-row">
            <span>Комиссия:</span>
            <span>{commission.toFixed(2)} USDT</span>
          </div>
          <div className="summary-row">
            <span>На адрес:</span>
            <span className="address-short">{address.slice(0, 8)}...{address.slice(-8)}</span>
          </div>
        </div>
      </div>
      
      <div className="result-actions">
        <button className="result-btn" onClick={() => navigate('/')}>
          🏠 На главную
        </button>
        <button className="result-btn secondary" onClick={() => {
          setStep(0);
          setAddress('');
          setAmount('');
          setAddressValid(null);
          setAmountValid(null);
          setAddressError('');
          setAmountError('');
          setProgress(0);
          setProcessing(false);
          loadUserBalance();
        }}>
          🔄 Новый вывод
        </button>
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className="withdraw-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка баланса...</p>
      </div>
    );
  }
  
  return (
    <div className="withdraw-page">
      {step === 0 && renderWithdrawForm()}
      {step === 1 && renderConfirmation()}
      {step === 2 && renderProcessing()}
      {step === 3 && renderResult()}
    </div>
  );
};

export default WithdrawPage;
