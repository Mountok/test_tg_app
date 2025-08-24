import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry, showRetry = true }) => {
  return (
    <div className="error-message-container">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message || 'Произошла ошибка'}</p>
      {showRetry && onRetry && (
        <button className="retry-button" onClick={onRetry}>
          Попробовать снова
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;