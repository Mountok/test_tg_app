import { TelegramInfo } from '../utils/auth';

/**
 * Хук для работы с Telegram WebApp
 * Возвращает информацию о пользователе и WebApp
 */
export const useTelegram = () => {
  const tg = window.Telegram?.WebApp;
  const user = TelegramInfo();

  return {
    tg,
    user,
    isWebApp: !!tg,
    telegramId: user?.id,
    username: user?.username,
    firstName: user?.first_name,
    lastName: user?.last_name
  };
};