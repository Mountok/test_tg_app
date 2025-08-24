import { TelegramInfo } from './auth';

const API_BASE_URL = 'https://plataplay.duckdns.org/api/v1/referral'; // Используем тот же сервер что и для основного API
const REFERRAL_API_READY = true; // API готов к использованию

// Базовая функция для API запросов
const apiRequest = async (endpoint, options = {}) => {
  console.log('[Referral API] Вызов:', endpoint, options);
  
  const telegramData = TelegramInfo();
  if (!telegramData?.id) {
    console.error('[Referral API] Нет данных Telegram пользователя');
    throw new Error('Не удалось получить данные пользователя Telegram');
  }

  console.log('[Referral API] Telegram ID:', telegramData.id);

  const defaultOptions = {
    headers: {
      'X-Telegram-ID': telegramData.id.toString(),
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('[Referral API] Полный URL:', fullUrl);
    console.log('[Referral API] API_BASE_URL:', API_BASE_URL);
    console.log('[Referral API] endpoint:', endpoint);
    
    const response = await fetch(fullUrl, { 
      ...defaultOptions, 
      ...options 
    });
    
    console.log('[Referral API] Ответ статус:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Referral API] Ошибка ответа:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('[Referral API] Данные ответа:', data);
    return data;
  } catch (error) {
    console.error('[Referral API] Ошибка запроса:', error);
    throw error;
  }
};

// Получение статуса реферальной программы пользователя
export const getReferralStatus = async () => {
  if (!REFERRAL_API_READY) {
    console.log('[Referral API] API еще не готов, возвращаем null для показа кнопки создания');
    return null; // Покажет кнопку "Создать реферальную ссылку"
  }

  try {
    return await apiRequest('/status');
  } catch (error) {
    // Если API вернул 404 (нет профиля), возвращаем null чтобы показать кнопку создания
    if (error.message.includes('404')) {
      console.log('Реферальный профиль не найден, нужно создать');
      return null;
    }
    // Если сервер недоступен
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Сервер реферальной программы недоступен. Попробуйте позже.');
    }
    throw error;
  }
};

// Получение информации об уровнях комиссий
export const getReferralLevels = async () => {
  return await apiRequest('/levels');
};

// Получение списка рефералов с пагинацией
export const getReferrals = async (page = 1, limit = 20, status = null) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (status && status !== 'all') {
    params.append('status', status);
  }

  return await apiRequest(`/referrals?${params}`);
};

// Регистрация по реферальному коду
export const registerByReferralCode = async (referralCode) => {
  return await apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify({
      referral_code: referralCode
    })
  });
};

// Создание реферального профиля для существующего пользователя
export const createReferralProfile = async () => {
  if (!REFERRAL_API_READY) {
    throw new Error('Реферальная программа находится в разработке. Попробуйте позже.');
  }

  try {
    return await apiRequest('/create-profile', {
      method: 'POST'
    });
  } catch (error) {
    // Добавляем более понятные сообщения об ошибках
    if (error.message.includes('404')) {
      throw new Error('Сервис реферальной программы временно недоступен');
    } else if (error.message.includes('403')) {
      throw new Error('Нет прав для создания реферального профиля');
    } else if (error.message.includes('500')) {
      throw new Error('Ошибка сервера при создании профиля');
    }
    throw error;
  }
};

// Утилита для копирования в буфер обмена
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback для старых браузеров
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackErr) {
      console.error('Не удалось скопировать в буфер обмена:', fallbackErr);
      return false;
    }
  }
};

// Утилита для шаринга ссылки
export const shareReferralLink = async (link, title = 'Присоединяйтесь к нашей платформе!') => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: 'Используйте мою реферальную ссылку для регистрации',
        url: link
      });
      return true;
    } catch (err) {
      // Пользователь отменил шаринг или произошла ошибка
      console.log('Шаринг отменен или не поддерживается');
      return false;
    }
  } else {
    // Fallback - копируем ссылку
    return await copyToClipboard(link);
  }
};

// Получение названия уровня
export const getLevelName = (levelId) => {
  const levels = {
    'level1': 'Junior',
    'level2': 'Pro',
    'level3': 'Ambassador'
  };
  return levels[levelId] || 'Junior';
};

// Форматирование даты
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Генерация Telegram реферальной ссылки
export const generateTelegramReferralLink = (referralCode) => {
  // Правильный формат для Mini App: без /app, только ?startapp с префиксом ref-
  return `https://t.me/PlataPay_bot?startapp=ref-${referralCode}`;
};

// Показ toast уведомления (простая реализация)
export const showToast = (message, type = 'info') => {
  // Можно заменить на более продвинутую систему уведомлений
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.textContent = message;
  
  const baseStyles = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 10000;
    font-size: 14px;
    max-width: 300px;
    text-align: center;
    animation: slideIn 0.3s ease-out;
  `;
  
  const typeStyles = {
    info: 'background: #333; color: white;',
    success: 'background: #22c55e; color: white;',
    error: 'background: #ef4444; color: white;',
    warning: 'background: #f59e0b; color: black;'
  };
  
  toast.style.cssText = baseStyles + (typeStyles[type] || typeStyles.info);
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 3000);
};