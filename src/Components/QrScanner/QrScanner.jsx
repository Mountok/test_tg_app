// src/Components/QrScanner/QrScanner.jsx

import { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import jsQR from 'jsqr';
import './QrScanner.css';
import PaymentModal from '../PaymentModal/PaymentModal';
import { ConvertRUBToUSDT } from '../../utils/convert';
import { useNavigate } from 'react-router-dom';
import { MdFlashlightOn, MdFlashlightOff } from 'react-icons/md';
import { FiImage } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import { BsCamera } from 'react-icons/bs';

const QrScanner = ({telegramID}) => {
  const html5QrCodeRef = useRef(null);
  const fileInputRef   = useRef(null);
  const navigate = useNavigate();

  const [scanning,   setScanning]   = useState(false);
  const [qrLink,     setQrLink]     = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [modalData,  setModalData]  = useState({ amountRub: 0, amountUsdt: 0 });
  const [flashlight, setFlashlight] = useState(false);

  const qrRegionId = 'qr-reader';

  // Общая обработка результата
  const handleDecoded = async (decodedText) => {
    setQrLink(decodedText);
    try {
      const resp = await ConvertRUBToUSDT(decodedText);
      setModalData({ amountRub: resp.amountRub, amountUsdt: resp.amountUsdt });
    } catch {
      setModalData({ amountRub: 0, amountUsdt: 0 });
    }
    setShowModal(true);
  };

  // 1) Сканирование через камеру
  const startScanner = async () => {
    setScanning(true);
    const html5QrCode = new Html5Qrcode(qrRegionId);
    html5QrCodeRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        decodedText => {
          html5QrCode.stop().then(() => html5QrCode.clear());
          handleDecoded(decodedText);
          setScanning(false);
        },
        err => {
          console.warn('Camera scan error:', err);
        }
      );
    } catch (e) {
      console.error('Ошибка запуска камеры:', e);
      setScanning(false);
    }
  };

  // 2) Сканирование изображения из галереи через jsQR
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code?.data) {
          handleDecoded(code.data);
        } else {
          alert(
            'Не удалось распознать QR-код на изображении.\n' +
            'Попробуйте обрезать фото так, чтобы QR-код был крупнее.'
          );
        }
      };
      img.onerror = () => {
        alert('Не удалось загрузить изображение.');
      };
      img.src = reader.result;
    };
    reader.onerror = () => {
      alert('Ошибка чтения файла.');
    };
    reader.readAsDataURL(file);

    // сброс, чтобы можно было выбрать тот же файл снова
    e.target.value = '';
  };

  // Функция для переключения фонарика
  const toggleFlashlight = async () => {
    if (!html5QrCodeRef.current) return;
    try {
      const stream = document.querySelector('#qr-reader video')?.srcObject;
      if (!stream) return;
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      if (!capabilities.torch) {
        alert('Фонарик не поддерживается на этом устройстве');
        return;
      }
      await track.applyConstraints({ advanced: [{ torch: !flashlight }] });
      setFlashlight(f => !f);
    } catch (e) {
      alert('Не удалось включить фонарик');
    }
  };

  return (
    <div className="qr-container">
      {/* Модалка с результатом */}
      <PaymentModal
        telegramID={telegramID}
        qrLink={qrLink}
        visible={showModal}
        data={modalData}
        onClose={() => setShowModal(false)}
      />

      {/* Область камеры */}
      <div id={qrRegionId} className="qr-camera-wrapper" />

      {/* Оверлей, рамка и анимация */}
      <div className="qr-overlay">
        <p className="qr-hint">
          Можно сканировать QR код с камеры или из галереи
        </p>
        <div className="qr-highlight-box">
          <div className="qr-corner top-left" />
          <div className="qr-corner top-right" />
          <div className="qr-corner bottom-left" />
          <div className="qr-corner bottom-right" />
          <div className="qr-scan-line" />
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="qr-buttons" style={{ justifyContent: 'center', gap: '48px' }}>
        {/* Фонарик */}
        <button
          type="button"
          className="qr-icon-btn"
          onClick={toggleFlashlight}
          aria-label="Фонарик"
          disabled={!scanning}
        >
          {flashlight ? (
            <MdFlashlightOn size={32} color={scanning ? '#fff' : '#888'} />
          ) : (
            <MdFlashlightOff size={32} color={scanning ? '#fff' : '#888'} />
          )}
        </button>
        {/* Камера */}
        <button
          type="button"
          className="qr-icon-btn"
          onClick={startScanner}
          aria-label="Включить камеру"
        >
          <BsCamera size={28} color="#fff" />
        </button>
        {/* Галерея */}
        <button
          type="button"
          className="qr-icon-btn"
          onClick={() => fileInputRef.current.click()}
          aria-label="Галерея"
          disabled={scanning}
        >
          <FiImage size={32} color={scanning ? '#888' : '#fff'} />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {/* Закрыть */}
        <button
          type="button"
          className="qr-icon-btn"
          onClick={() => navigate('/')}
          aria-label="Закрыть"
        >
          <RxCross2 size={32} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default QrScanner;
 