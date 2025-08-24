import React, { useState, useEffect } from 'react';
import './Toast.css';

// Контекст для управления Toast уведомлениями
let toastInstance = null;

export const showToast = (message, type = 'success') => {
  if (toastInstance) {
    toastInstance(message, type);
  }
};

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Регистрируем глобальную функцию
    toastInstance = (message, type) => {
      const id = Date.now();
      const newToast = { id, message, type };
      
      setToasts(prev => [...prev, newToast]);

      // Автоматически удаляем через 3 секунды
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 3000);
    };

    return () => {
      toastInstance = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className={`toast toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;