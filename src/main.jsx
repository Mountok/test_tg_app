import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'



import { init, miniApp } from '@telegram-apps/sdk';


const initializeTelegramSDK = async () => {
  try {
    await init();

    if (miniApp.ready.isAvailable()) {
      await miniApp.ready();
      console.log('Mini App готово');

      // Устанавливаем цвет заголовка
      miniApp.setHeaderColor('#fcb69f');

      // Получаем данные пользователя
      const user = miniApp.initDataUnsafe.user;

      if (user) {
        const telegramId = user.id;
        const nickname = user.username || user.first_name;

        // Сохраняем в localStorage
        localStorage.setItem('telegramId', telegramId.toString());
        localStorage.setItem('nickname', nickname);

        console.log('Пользователь:', telegramId, nickname);
      } else {
        console.warn('Пользовательские данные не доступны');
      }
    }



  } catch (error) {
    console.error('Ошибка инициализации:', error);
  }
};

initializeTelegramSDK();


initializeTelegramSDK();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)