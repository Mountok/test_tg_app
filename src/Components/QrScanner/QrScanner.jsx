import { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import './QrScanner.css';

const QrScanner = () => {
  const [result, setResult] = useState('');
  const [scanning, setScanning] = useState(false);
  const html5QrCodeRef = useRef(null);
  const qrRegionId = 'qr-reader';

  const sendRequest = async (amount, from, to) => {
    console.log({ amount, from, to });
    try {
      const response = await axios.post('https://platapay-back.onrender.com/api/wallet/convert', {
        amount,
        from,
        to,
      });

      console.log(response)
      setResult(`Конвертированная сумма: ${response.data.data.message}`);
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  };

  const parseQRCodeData = (qrData) => {
    try {
      const urlParams = new URLSearchParams(new URL(qrData).search);
      const amount = parseFloat(urlParams.get('sum')) / 100;
      const from = urlParams.get('cur');
      const to = 'USDT';
      sendRequest(amount, from, to);
    } catch (error) {
      console.error('Ошибка при парсинге QR данных:', error);
    }
  };

  const startScanner = async () => {
    setScanning(true);

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    const html5QrCode = new Html5Qrcode(qrRegionId);
    html5QrCodeRef.current = html5QrCode;

    try {
      await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            setResult(decodedText);
            html5QrCode.stop().then(() => {
              html5QrCode.clear();
              setScanning(false);
            });
            parseQRCodeData(decodedText);
          },
          (error) => {
            console.log(error)
          }
      );
    } catch (err) {
      console.error('Ошибка при доступе к камере:', err);
      setScanning(false);
    }
  };

  return (
      <div className="qr-wrapper">
        <h2 className="qr-heading">🔍 Сканер QR СБП</h2>

        {!scanning && !result && (
            <button onClick={startScanner} className="qr-button">
              Начать сканирование
            </button>
        )}

        <div id={qrRegionId} className="qr-scanner"></div>

        {result && (
            <div className="qr-result">
              <strong>📋 Результат:</strong>
              <br />
              <span>{result} USDT</span>
            </div>
        )}

        {!result && scanning && (
            <div className="qr-info-text">
              Наведите камеру на QR код, чтобы начать сканирование.
            </div>
        )}
      </div>
  );
};

export default QrScanner;
