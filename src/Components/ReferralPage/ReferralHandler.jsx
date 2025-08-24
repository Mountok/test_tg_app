import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ReferralHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Читаем из start_param формат ref-<CODE>
    const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param || '';
    console.log('[ReferralHandler] start_param:', startParam);
    
    const refFromStart = startParam.startsWith('ref-') ? startParam.slice(4) : null;
    const refFromQuery = searchParams.get('ref');
    
    console.log('[ReferralHandler] refFromStart:', refFromStart);
    console.log('[ReferralHandler] refFromQuery:', refFromQuery);

    const refCode = refFromStart || refFromQuery;
    if (refCode) {
      localStorage.setItem('pending_referral_code', refCode);
      console.log('[ReferralHandler] Реферальный код сохранен в localStorage:', refCode);
      
      // Показываем алерт для диагностики
      if (window.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert(`Реферальный код получен: ${refCode}`);
      }
      
      navigate('/', { replace: true });
    } else {
      console.log('[ReferralHandler] Реферальный код не найден');
    }
  }, [searchParams, navigate]);

  return null; // Этот компонент не рендерит ничего видимого
};

export default ReferralHandler;