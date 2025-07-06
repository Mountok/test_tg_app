// src/Components/QrScanner/QrScanner.jsx

import { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import './QrScanner.css';
import PaymentModal from '../PaymentModal/PaymentModal';
import { ConvertRUBToUSDT } from '../../utils/convert';
import { processQRImage, getCameraConstraints, getQRSupportInfo } from '../../utils/qrProcessor';
import { useNavigate } from 'react-router-dom';
import { MdFlashlightOn, MdFlashlightOff } from 'react-icons/md';
import { FiImage } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import { BsCamera } from 'react-icons/bs';
import { FiAlertTriangle } from 'react-icons/fi';

const QrScanner = ({telegramID}) => {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [scanning, setScanning] = useState(false);
  const [qrLink, setQrLink] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ amountRub: 0, amountUsdt: 0 });
  const [flashlight, setFlashlight] = useState(false);
  const [showNoDetectModal, setShowNoDetectModal] = useState(false);
  const [modalLeaving, setModalLeaving] = useState(false);
  const [reader, setReader] = useState(null);
  const [stream, setStream] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [supportInfo, setSupportInfo] = useState(null);

  // Получаем информацию о поддержке при инициализации
  useEffect(() => {
    setSupportInfo(getQRSupportInfo());
    console.log('[QR] Информация о поддержке:', getQRSupportInfo());
  }, []);

  // Общая обработка результата
  const handleDecoded = async (decodedText, isImage = false) => {
    setProcessingImage(false);
    
    if (isImage) {
      console.log('[QR] Не удалось распознать QR-код, сохраняю изображение в dataURL');
      console.log('[QR] data:image:', decodedText);
      setQrLink(decodedText);
      setModalData({ amountRub: 0, amountUsdt: 0 });
      setShowModal(true);
      return;
    }
    console.log('[QR] Успешно распознан QR-код:', decodedText);
    setQrLink(decodedText);
    try {
      const resp = await ConvertRUBToUSDT(decodedText);
      setModalData({ amountRub: resp.amountRub, amountUsdt: resp.amountUsdt });
    } catch {
      setModalData({ amountRub: 0, amountUsdt: 0 });
    }
    setShowModal(true);
  };

  // Обработка успешного сканирования
  const handleScanSuccess = (result) => {
    if (result && result.getText()) {
      console.log('[QR] ZXing распознал QR:', result.getText());
      stopScanner();
      handleDecoded(result.getText());
    }
  };

  // Обработка ошибок сканирования
  const handleScanError = (error) => {
    // Игнорируем ошибки NotFoundException - это нормально при сканировании
    if (error.name === 'NotFoundException' || error.name === 'NotFoundException2') {
      return;
    }
    console.log('[QR] Ошибка сканирования:', error.name, error.message);
  };

  // Запуск сканера с оптимизацией для iOS
  const startScanner = async () => {
    if (scanning) return;
    
    setScanning(true);
    setShowNoDetectModal(false);
    
    try {
      const codeReader = new BrowserMultiFormatReader();
      setReader(codeReader);

      // Используем оптимизированные настройки камеры
      const videoConstraints = getCameraConstraints();

      // Получаем доступ к камере
      const mediaStream = await navigator.mediaDevices.getUserMedia(videoConstraints);

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      // Запускаем сканирование
      await codeReader.decodeFromVideoDevice(
        undefined, // используем первую доступную камеру
        videoRef.current,
        handleScanSuccess,
        handleScanError
      );

      // Показываем модалку через 15 секунд, если не найден QR
      setTimeout(() => {
        if (scanning) {
          setShowNoDetectModal(true);
        }
      }, 15000);

    } catch (error) {
      console.error('[QR] Ошибка запуска камеры:', error);
      setScanning(false);
      alert('Не удалось получить доступ к камере. Проверьте разрешения.');
    }
  };

  // Остановка сканера
  const stopScanner = () => {
    setScanning(false);
    setShowNoDetectModal(false);
    
    if (reader) {
      try {
        reader.reset();
      } catch (error) {
        console.log('[QR] Ошибка при остановке reader:', error);
      }
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  // Упрощенное сканирование изображения с использованием утилиты
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessingImage(true);
    
    try {
      // Используем новый утилитарный файл для обработки
      const qrCode = await processQRImage(file, {
        enableBackendFallback: false, // Можно включить, если есть бэкенд
        maxAttempts: 8,
        skipZXingOnIOS: true
      });

      if (qrCode) {
        handleDecoded(qrCode);
      } else {
        // Если не удалось распознать — отправляем dataURL
        const reader = new FileReader();
        reader.onload = () => {
          handleDecoded(reader.result, true);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('[QR] Ошибка обработки изображения:', error);
      alert('Ошибка обработки изображения');
      setProcessingImage(false);
    }

    // сброс, чтобы можно было выбрать тот же файл снова
    e.target.value = '';
  };

  // Функция для переключения фонарика
  const toggleFlashlight = async () => {
    if (!stream) return;
    
    try {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (!capabilities.torch) {
        alert('Фонарик не поддерживается на этом устройстве');
        return;
      }
      
      await track.applyConstraints({ 
        advanced: [{ torch: !flashlight }] 
      });
      setFlashlight(f => !f);
    } catch (e) {
      console.error('[QR] Ошибка переключения фонарика:', e);
      alert('Не удалось переключить фонарик');
    }
  };

  // Минималистичная модалка для "QR не распознан"
  const handleCloseNoDetectModal = () => {
    setModalLeaving(true);
    setTimeout(() => {
      setShowNoDetectModal(false);
      setModalLeaving(false);
    }, 350);
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

      {/* Минималистичная модалка */}
      {showNoDetectModal && (
        <div className={`qr-nodetect-modal${modalLeaving ? ' leaving' : ''}`}>
          <FiAlertTriangle size={32} color="#e74c3c" style={{ marginRight: 10 }} />
          <span style={{ flex: 1 }}>
            Не удалось распознать QR-код. Пожалуйста, воспользуйтесь загрузкой фото.
          </span>
          <button className="qr-nodetect-close" onClick={handleCloseNoDetectModal}>
            <RxCross2 size={24} color="#fff" />
          </button>
        </div>
      )}

      {/* Индикатор обработки изображения */}
      {processingImage && (
        <div className="qr-processing-modal">
          <div className="qr-processing-spinner"></div>
          <span>Обработка изображения...</span>
        </div>
      )}

      {/* Видео элемент для камеры */}
      <video
        ref={videoRef}
        className="qr-camera-video"
        autoPlay
        playsInline
        muted
      />

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
          onClick={scanning ? stopScanner : startScanner}
          aria-label={scanning ? "Остановить камеру" : "Включить камеру"}
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
 