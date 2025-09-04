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
import { useI18n } from '../../i18n/I18nProvider.jsx';

const QrScanner = ({telegramID}) => {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useI18n();

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
    const startTime = Date.now();
    console.log(`[QR] 🔄 Начало обработки результата сканирования. Тип: ${isImage ? 'изображение' : 'камера'}`);

    setProcessingImage(false);

    if (isImage) {
      console.log('[QR] ❌ Не удалось распознать QR-код в изображении, сохраняю как dataURL');
      console.log('[QR] 📷 DataURL получен:', decodedText.substring(0, 100) + '...');
      console.log('[QR] 📊 Длина dataURL:', decodedText.length, 'символов');
      setQrLink(decodedText);
      setModalData({ amountRub: 0, amountUsdt: 0 });
      setShowModal(true);
      console.log(`[QR] ✅ Обработка завершена за ${Date.now() - startTime}ms`);
      return;
    }

    console.log('[QR] ✅ Успешно распознан QR-код из камеры');
    console.log('[QR] 🔗 Содержимое QR-кода:', decodedText);

    // Анализируем тип ссылки
    if (decodedText.startsWith('http://') || decodedText.startsWith('https://')) {
      console.log('[QR] 🌐 Тип ссылки: HTTP/HTTPS URL');
    } else if (decodedText.startsWith('bitcoin:') || decodedText.startsWith('ethereum:')) {
      console.log('[QR] ₿ Тип ссылки: Криптовалютный адрес');
    } else if (decodedText.includes('@') && decodedText.includes('.')) {
      console.log('[QR] 📧 Тип ссылки: Email адрес');
    } else {
      console.log('[QR] ❓ Тип ссылки: Неизвестный формат');
    }

    setQrLink(decodedText);
    try {
      console.log('[QR] 💰 Начинаю конвертацию RUB в USDT...');
      const convertStartTime = Date.now();
      const resp = await ConvertRUBToUSDT(decodedText);
      console.log(`[QR] 💰 Конвертация завершена за ${Date.now() - convertStartTime}ms`);
      console.log('[QR] 💰 Результат конвертации:', {
        amountRub: resp.amountRub,
        amountUsdt: resp.amountUsdt
      });
      setModalData({ amountRub: resp.amountRub, amountUsdt: resp.amountUsdt });
    } catch (error) {
      console.log('[QR] ❌ Ошибка конвертации:', error.message);
      setModalData({ amountRub: 0, amountUsdt: 0 });
    }
    setShowModal(true);
    console.log(`[QR] 🎉 Полный процесс обработки завершен за ${Date.now() - startTime}ms`);
  };

  // Обработка успешного сканирования
  const handleScanSuccess = (result) => {
    if (result && result.getText()) {
      const scanTime = Date.now();
      console.log('[QR] 📱 Камера зафиксировала QR-код');
      console.log('[QR] 🔍 ZXing успешно распознал содержимое:', result.getText());
      console.log('[QR] 📏 Длина текста QR-кода:', result.getText().length, 'символов');

      // Логируем формат результата ZXing
      console.log('[QR] 📋 Детали результата:', {
        timestamp: new Date(scanTime).toISOString(),
        hasText: !!result.getText(),
        textLength: result.getText().length,
        barcodeFormat: result.getBarcodeFormat?.() || 'неизвестный'
      });

      stopScanner();
      console.log('[QR] 🛑 Сканер остановлен, передаю данные на обработку');
      handleDecoded(result.getText());
    } else {
      console.log('[QR] ⚠️ ZXing вернул пустой результат');
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

    console.log('[QR] 🚀 Запуск процесса сканирования QR-кода');
    const startTime = Date.now();

    setScanning(true);
    setShowNoDetectModal(false);

    try {
      console.log('[QR] 📚 Инициализация ZXing BrowserMultiFormatReader');
      const codeReader = new BrowserMultiFormatReader();
      setReader(codeReader);

      // Используем оптимизированные настройки камеры
      console.log('[QR] ⚙️ Получение настроек камеры');
      const videoConstraints = getCameraConstraints();
      console.log('[QR] 📷 Настройки камеры:', videoConstraints);

      // Получаем доступ к камере
      console.log('[QR] 🎥 Запрос доступа к камере...');
      const cameraAccessStart = Date.now();
      const mediaStream = await navigator.mediaDevices.getUserMedia(videoConstraints);
      console.log(`[QR] ✅ Доступ к камере получен за ${Date.now() - cameraAccessStart}ms`);

      setStream(mediaStream);

      if (videoRef.current) {
        console.log('[QR] 🎬 Настройка видео элемента');
        videoRef.current.srcObject = mediaStream;
        console.log('[QR] ▶️ Запуск воспроизведения видео');
        await videoRef.current.play();
        console.log('[QR] ✅ Видео запущено');
      }

      // Запускаем сканирование
      console.log('[QR] 🔄 Запуск процесса распознавания QR-кодов через ZXing');
      console.log('[QR] 📱 Используется первая доступная камера');
      await codeReader.decodeFromVideoDevice(
        undefined, // используем первую доступную камеру
        videoRef.current,
        handleScanSuccess,
        handleScanError
      );
      console.log(`[QR] 🎯 ZXing сканер запущен и готов к работе за ${Date.now() - startTime}ms`);

      // Показываем модалку через 15 секунд, если не найден QR
      setTimeout(() => {
        if (scanning) {
          setShowNoDetectModal(true);
        }
      }, 15000);

    } catch (error) {
      console.error('[QR] Ошибка запуска камеры:', error);
      setScanning(false);
      alert(t('qr.cameraAccessError') || 'Не удалось получить доступ к камере. Проверьте разрешения.');
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

    console.log('[QR] 📁 Выбран файл из галереи');
    console.log('[QR] 📄 Информация о файле:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    });

    const processStartTime = Date.now();
    setProcessingImage(true);

    try {
      console.log('[QR] 🔍 Начало обработки изображения через утилиту processQRImage');
      console.log('[QR] ⚙️ Параметры обработки:', {
        enableBackendFallback: false,
        maxAttempts: 8,
        skipZXingOnIOS: true
      });

      // Используем новый утилитарный файл для обработки
      const qrProcessStart = Date.now();
      const qrCode = await processQRImage(file, {
        enableBackendFallback: false, // Можно включить, если есть бэкенд
        maxAttempts: 8,
        skipZXingOnIOS: true
      });

      console.log(`[QR] 🔍 Обработка изображения завершена за ${Date.now() - qrProcessStart}ms`);

      if (qrCode) {
        console.log('[QR] ✅ QR-код успешно распознан в изображении:', qrCode);
        handleDecoded(qrCode);
      } else {
        console.log('[QR] ❌ QR-код не найден в изображении, конвертирую в dataURL');
        // Если не удалось распознать — отправляем dataURL
        const reader = new FileReader();
        reader.onload = () => {
          console.log('[QR] 📷 Изображение конвертировано в dataURL');
          handleDecoded(reader.result, true);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('[QR] 💥 Критическая ошибка обработки изображения:', error);
      console.error('[QR] 📋 Детали ошибки:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      alert(t('qr.imageProcessError') || 'Ошибка обработки изображения');
      setProcessingImage(false);
    }

    console.log(`[QR] 🏁 Обработка файла завершена за ${Date.now() - processStartTime}ms`);

    // сброс, чтобы можно было выбрать тот же файл снова
    e.target.value = '';
  };

  // Функция для переключения фонарика
  const toggleFlashlight = async () => {
    console.log('[QR] 💡 Попытка переключения фонарика');

    if (!stream) {
      console.log('[QR] ❌ Нет активного видеопотока для управления фонариком');
      return;
    }

    try {
      const track = stream.getVideoTracks()[0];
      console.log('[QR] 📹 Получен видеотрек для управления фонариком');

      const capabilities = track.getCapabilities();
      console.log('[QR] ⚙️ Возможности камеры:', capabilities);

      if (!capabilities.torch) {
        console.log('[QR] ❌ Фонарик не поддерживается на этом устройстве');
        alert(t('qr.flashNotSupported') || 'Фонарик не поддерживается на этом устройстве');
        return;
      }

      const newTorchState = !flashlight;
      console.log(`[QR] 🔄 Переключение фонарика: ${flashlight} → ${newTorchState}`);

      await track.applyConstraints({
        advanced: [{ torch: newTorchState }]
      });

      setFlashlight(f => !f);
      console.log(`[QR] ✅ Фонарик ${newTorchState ? 'включен' : 'выключен'} успешно`);

    } catch (e) {
      console.error('[QR] 💥 Ошибка переключения фонарика:', e);
      console.error('[QR] 📋 Детали ошибки фонарика:', {
        name: e.name,
        message: e.message,
        stack: e.stack
      });
      alert(t('qr.flashToggleError') || 'Не удалось переключить фонарик');
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
        onClose={() => {
          setShowModal(false);
          setQrLink('');
          setModalData({ amountRub: 0, amountUsdt: 0 });
          // Останавливаем сканер при закрытии модального окна
          stopScanner();
        }}
      />

      {/* Минималистичная модалка */}
      {showNoDetectModal && (
        <div className={`qr-nodetect-modal${modalLeaving ? ' leaving' : ''}`}>
          <FiAlertTriangle size={32} color="#e74c3c" style={{ marginRight: 10 }} />
          <span style={{ flex: 1 }}>
            {t('qr.notDetected') || 'Не удалось распознать QR-код. Пожалуйста, воспользуйтесь загрузкой фото.'}
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
          <span>{t('qr.processing') || 'Обработка изображения...'}</span>
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
          {t('qr.hint') || 'Можно сканировать QR код с камеры или из галереи'}
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
          aria-label={scanning ? (t('qr.stopCamera') || 'Остановить камеру') : (t('qr.startCamera') || 'Включить камеру')}
        >
          <BsCamera size={28} color="#fff" />
        </button>
        {/* Галерея */}
        <button
          type="button"
          className="qr-icon-btn"
          onClick={() => fileInputRef.current.click()}
          aria-label={t('qr.gallery') || 'Галерея'}
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
          aria-label={t('common.close') || 'Закрыть'}
        >
          <RxCross2 size={32} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default QrScanner;
 