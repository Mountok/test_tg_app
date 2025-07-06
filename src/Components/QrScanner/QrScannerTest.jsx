import React from 'react';
import QRCode from 'react-qrcode-logo';
import QrScanner from './QrScanner';

const QrScannerTest = () => {
  const testQRData = 'https://example.com/test-qr-code-123456789';

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Тест QR-сканера</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Тестовый QR-код для сканирования:</h3>
        <div style={{ 
          display: 'inline-block', 
          padding: '20px', 
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <QRCode 
            value={testQRData}
            size={200}
            qrStyle="dots"
            eyeRadius={5}
          />
        </div>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Данные: {testQRData}
        </p>
      </div>

      <div style={{ 
        border: '2px solid #ccc', 
        borderRadius: '10px', 
        padding: '10px',
        marginBottom: '20px'
      }}>
        <h3>QR-сканер:</h3>
        <div style={{ height: '400px', position: 'relative' }}>
          <QrScanner telegramID="test" />
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '8px',
        textAlign: 'left'
      }}>
        <h4>Инструкции для тестирования:</h4>
        <ul>
          <li>Нажмите кнопку камеры для запуска сканера</li>
          <li>Наведите камеру на QR-код выше</li>
          <li>Или используйте кнопку галереи для загрузки изображения с QR-кодом</li>
          <li>Проверьте консоль браузера для подробного логирования</li>
        </ul>
      </div>
    </div>
  );
};

export default QrScannerTest; 