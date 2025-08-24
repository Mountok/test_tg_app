import React, { useState, useEffect } from 'react';
import './ReferralPage.css';
import { useNavigate } from 'react-router-dom';
import { 
  getReferralStatus, 
  createReferralProfile, 
  copyToClipboard, 
  shareReferralLink, 
  getLevelName, 
  showToast,
  generateTelegramReferralLink,
  registerByReferralCode
} from '../../utils/referral';
import { useI18n } from '../../i18n/I18nProvider.jsx';

const ReferralPage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLevelsModal, setShowLevelsModal] = useState(false);
  
  // Состояния для ручного ввода реферального кода
  const [manualRefCode, setManualRefCode] = useState('');
  const [isSubmittingRefCode, setIsSubmittingRefCode] = useState(false);
  const [hasExistingReferrer, setHasExistingReferrer] = useState(false);

  useEffect(() => {
    fetchReferralStatus();
  }, []);

  const fetchReferralStatus = async () => {
    console.log('[ReferralPage] Начинаем загрузку статуса реферальной программы');
    try {
      const data = await getReferralStatus();
      console.log('[ReferralPage] Получены данные:', data);
      setReferralData(data);
      
      // Проверяем, есть ли уже привязанный реферер
      if (data && data.referrer_code) {
        setHasExistingReferrer(true);
        console.log('[ReferralPage] У пользователя уже есть реферер:', data.referrer_code);
      }
      
      setError(null); // Сбрасываем ошибку при успешном запросе
    } catch (err) {
      console.error('[ReferralPage] Ошибка при получении статуса:', err);
      console.error('[ReferralPage] Тип ошибки:', typeof err);
      console.error('[ReferralPage] Сообщение ошибки:', err.message);
      console.error('[ReferralPage] Стек ошибки:', err.stack);
      setError(err.message);
      setReferralData(null); // Сбрасываем данные при ошибке
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    try {
      setLoading(true);
      const data = await createReferralProfile();
      setReferralData(data);
      showToast('Реферальный профиль успешно создан!', 'success');
    } catch (err) {
      setError(err.message);
      showToast('Ошибка при создании профиля', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async (text) => {
    const success = await copyToClipboard(text);
    if (success) {
      showToast('Скопировано в буфер обмена', 'success');
    } else {
      showToast('Ошибка при копировании', 'error');
    }
  };

  const handleShareLink = async () => {
    const link = generateTelegramReferralLink(referralData?.referral_code);
    const success = await shareReferralLink(link);
    if (!success) {
      // Если шаринг не удался, пробуем скопировать
      handleCopyToClipboard(link);
    }
  };

  // Обработка ручного ввода реферального кода
  const handleSubmitReferralCode = async () => {
    if (!manualRefCode.trim()) {
      showToast('Введите реферальный код', 'error');
      return;
    }

    setIsSubmittingRefCode(true);
    try {
      await registerByReferralCode(manualRefCode.trim());
      showToast('Реферальный код успешно применен!', 'success');
      setHasExistingReferrer(true);
      setManualRefCode('');
      
      // Обновляем данные
      await fetchReferralStatus();
    } catch (err) {
      console.error('[ReferralPage] Ошибка при привязке реферального кода:', err);
      showToast(`Ошибка: ${err.message}`, 'error');
    } finally {
      setIsSubmittingRefCode(false);
    }
  };

  if (loading) {
    return (
      <div className="referral-page">
        <div className="referral-header">
          <button className="referral-back-btn" onClick={() => navigate(-1)}>
            &#8592;
          </button>
          <span className="referral-title">{t('referral.title') || 'Партнерская программа'}</span>
        </div>
        <div className="referral-loading">{t('common.loading') || 'Загрузка...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="referral-page">
        <div className="referral-header">
          <button className="referral-back-btn" onClick={() => navigate(-1)}>
            &#8592;
          </button>
          <span className="referral-title">{t('referral.title') || 'Партнерская программа'}</span>
        </div>
        <div className="referral-error">
          <p>{t('common.error') || 'Ошибка'}: {error}</p>
          <button onClick={fetchReferralStatus} className="retry-btn">
            {t('common.retry') || 'Попробовать снова'}
          </button>
        </div>
      </div>
    );
  }

  // Если реферального профиля нет (нет данных или нет кода), показываем кнопку создания
  if (!referralData || !referralData?.referral_code) {
    return (
      <div className="referral-page">
        <div className="referral-header">
          <button className="referral-back-btn" onClick={() => navigate(-1)}>
            &#8592;
          </button>
          <span className="referral-title">{t('referral.title') || 'Партнерская программа'}</span>
        </div>
        
        <div className="referral-hero">
          <h1>{t('referral.title') || 'Партнерская программа'}</h1>
          <p>{t('referral.subtitle') || 'Получайте до 30% от наших комиссий с платежей каждого приглашенного друга.'}</p>
        </div>

        {/* Секция ввода реферального кода */}
        {!hasExistingReferrer && (
          <div className="manual-referral-section">
            <h3>Есть реферальный код?</h3>
            <p>Введите код пригласившего вас пользователя:</p>
            <div className="referral-input-group">
              <input
                type="text"
                value={manualRefCode}
                onChange={(e) => setManualRefCode(e.target.value.toUpperCase())}
                placeholder="Введите код (например: ABC123)"
                disabled={isSubmittingRefCode}
                className="referral-code-input"
                maxLength={10}
              />
              <button
                onClick={handleSubmitReferralCode}
                disabled={isSubmittingRefCode || !manualRefCode.trim()}
                className="btn-secondary"
              >
                {isSubmittingRefCode ? 'Применяем...' : 'Применить'}
              </button>
            </div>
          </div>
        )}

        {/* Показываем информацию о привязанном реферере */}
        {hasExistingReferrer && referralData?.referrer_code && (
          <div className="existing-referrer-info">
            <h3>✅ Реферальный код применен</h3>
            <p>Вы приглашены пользователем с кодом: <strong>{referralData.referrer_code}</strong></p>
          </div>
        )}

        <div className="create-profile-section">
          <p>{t('referral.createProfileText') || 'Для участия в реферальной программе создайте свой профиль.'}</p>
          <button onClick={handleCreateProfile} className="btn-primary">
            {t('referral.createProfileBtn') || 'Создать реферальную ссылку'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="referral-page">
      <div className="referral-header">
        <button className="referral-back-btn" onClick={() => navigate(-1)}>
          &#8592;
        </button>
        <span className="referral-title">{t('referral.title') || 'Партнерская программа'}</span>
      </div>
      
      <div className="referral-hero">
        <h1>{t('referral.title') || 'Партнерская программа'}</h1>
        <p>{t('referral.subtitle') || 'Получайте до 30% от наших комиссий с платежей каждого приглашенного друга.'}</p>
      </div>

      {/* Реферальный код и ссылка */}
      <div className="referral-code-section">
        <div className="code-item">
          <label>{t('referral.yourCode') || 'Ваш код:'}</label>
          <div className="code-display">
            <span>{referralData?.referral_code}</span>
            <button onClick={() => handleCopyToClipboard(referralData?.referral_code)}>
              {t('common.copy') || 'Копировать'}
            </button>
          </div>
        </div>
        
        <div className="link-item">
          <label>{t('referral.yourLink') || 'Ваша ссылка:'}</label>
          <div className="link-display">
            <span>{generateTelegramReferralLink(referralData?.referral_code)}</span>
            <button onClick={() => handleCopyToClipboard(generateTelegramReferralLink(referralData?.referral_code))}>
              {t('common.copy') || 'Копировать'}
            </button>
          </div>
        </div>
        
        <button className="share-button" onClick={handleShareLink}>{t('referral.share') || 'Поделиться ссылкой'}</button>
      </div>

      {/* Статистика */}
      <div className="referral-stats">
        <h3>{t('referral.stats') || 'Ваша статистика'}</h3>
        
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">{t('referral.level') || 'Уровень:'}</span>
            <span className="stat-value">{getLevelName(referralData?.level)}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">{t('referral.commissionRate') || 'Ставка комиссии:'}</span>
            <span className="stat-value">{referralData?.commission_rate}%</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">{t('referral.active') || 'Активные рефералы:'}</span>
            <span className="stat-value">{referralData?.stats.active_count}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">{t('referral.inactive') || 'Неактивные рефералы:'}</span>
            <span className="stat-value">{referralData?.stats.inactive_count}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">{t('referral.available') || 'Доступно к выводу:'}</span>
            <span className="stat-value">{referralData?.balance.available} USDT</span>
          </div>
        </div>
      </div>

      {/* Действия */}
      <div className="referral-actions">
        <button onClick={() => setShowLevelsModal(true)} className="btn-secondary">{t('referral.viewLevels') || 'Посмотреть условия комиссий'}</button>
        
        <button onClick={() => navigate('/referral/list')} className="btn-primary">{t('referral.viewList') || 'Посмотреть список рефералов'}</button>
      </div>

      {/* Модальное окно условий (упрощенная версия) */}
      {showLevelsModal && (
        <div className="modal-overlay" onClick={() => setShowLevelsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('referral.levelsAndTerms') || 'Условия и комиссии'}</h3>
              <button onClick={() => setShowLevelsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="levels-info">
                <div className="level-item">
                  <h4>5% комиссия</h4>
                  <p>До 20 USDT оборота от реферала</p>
                </div>
                <div className="level-item">
                  <h4>10% комиссия</h4>
                  <p>От 100 USDT оборота от реферала</p>
                </div>
                <div className="level-item">
                  <h4>20% Амбассадорство</h4>
                  <p>Присуждается особый статус тому, кто привлек более 50 пользователей</p>
                </div>
              </div>
              <div className="definition">
                <p><strong>Активный реферал</strong> — пользователь, совершивший QR-платежей на сумму от 30 USDT за последние 90 дней.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralPage;