import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './theme/ThemeProvider.jsx';
import { I18nProvider } from './i18n/I18nProvider.jsx';

// Диагностика/ограничения в Telegram iOS
const isTelegramIOS = window?.Telegram?.WebApp?.platform === 'ios';
const debugMode = new URLSearchParams(window.location.search).get('debug') === '1';

if (debugMode) {
  window.addEventListener('error', (event) => {
    console.error('[GlobalError]', event?.error || event?.message);
    try {
      window?.Telegram?.WebApp?.showAlert?.(`Ошибка: ${event?.message || 'unknown'}`);
    } catch {}
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[UnhandledRejection]', event?.reason);
    try {
      window?.Telegram?.WebApp?.showAlert?.(`Unhandled: ${event?.reason?.message || event?.reason || 'unknown'}`);
    } catch {}
  });
}

// Регистрация Service Worker для PWA (отключаем в Telegram iOS во избежание белого экрана из-за кэша)
if ('serviceWorker' in navigator && !isTelegramIOS) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[SW] Service Worker зарегистрирован:', registration);
      })
      .catch((error) => {
        console.log('[SW] Ошибка регистрации Service Worker:', error);
      });
  });
} else if (isTelegramIOS) {
  console.log('[SW] Отключена регистрация Service Worker в Telegram iOS');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </I18nProvider>
  </StrictMode>,
);
