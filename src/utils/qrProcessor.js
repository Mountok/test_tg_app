import jsQR from 'jsqr';
// Импортируем BarcodeDetectorPolyfill
import BarcodeDetectorPolyfill from 'barcode-detector-polyfill';

// Определяем платформу
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
const isIOSSafari = isIOS && isSafari;

// Принудительно используем полифил на iOS/Safari
if (typeof window !== 'undefined' && (!('BarcodeDetector' in window) || isIOSSafari)) {
  window.BarcodeDetector = BarcodeDetectorPolyfill;
}

/**
 * Обработка изображения с множественными попытками распознавания
 * @param {File|string} imageSource - Файл или dataURL изображения
 * @param {Object} options - Опции обработки
 * @returns {Promise<string|null>} - Распознанный QR-код или null
 */
export const processQRImage = async (imageSource, options = {}) => {
  const {
    enableBackendFallback = false,
    backendUrl = null,
    maxAttempts = 9,
    skipZXingOnIOS = true
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        
        // Попытки распознавания в порядке приоритета
        const attempts = [
          // 1. jsQR (основной метод для iOS)
          async () => {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);
            return code?.data || null;
          },
          // 2. jsQR с увеличенным изображением
          async () => {
            const scaledCanvas = document.createElement('canvas');
            const scaledCtx = scaledCanvas.getContext('2d');
            scaledCanvas.width = canvas.width * 2;
            scaledCanvas.height = canvas.height * 2;
            scaledCtx.imageSmoothingEnabled = true;
            scaledCtx.imageSmoothingQuality = 'high';
            scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
            const scaledImageData = scaledCtx.getImageData(0, 0, scaledCanvas.width, scaledCanvas.height);
            const code = jsQR(scaledImageData.data, scaledCanvas.width, scaledCanvas.height);
            return code?.data || null;
          },
          // 3. jsQR с улучшенным контрастом
          async () => {
            const contrastCanvas = document.createElement('canvas');
            const contrastCtx = contrastCanvas.getContext('2d');
            contrastCanvas.width = canvas.width;
            contrastCanvas.height = canvas.height;
            contrastCtx.filter = 'contrast(1.5) brightness(1.2)';
            contrastCtx.drawImage(canvas, 0, 0);
            const contrastImageData = contrastCtx.getImageData(0, 0, contrastCanvas.width, contrastCanvas.height);
            const code = jsQR(contrastImageData.data, contrastCanvas.width, contrastCanvas.height);
            return code?.data || null;
          },
          // 4. jsQR с черно-белым изображением
          async () => {
            const bwCanvas = document.createElement('canvas');
            const bwCtx = bwCanvas.getContext('2d');
            bwCanvas.width = canvas.width;
            bwCanvas.height = canvas.height;
            bwCtx.filter = 'grayscale(1) contrast(2)';
            bwCtx.drawImage(canvas, 0, 0);
            const bwImageData = bwCtx.getImageData(0, 0, bwCanvas.width, bwCanvas.height);
            const code = jsQR(bwImageData.data, bwCanvas.width, bwCanvas.height);
            return code?.data || null;
          },
          // 5. ZXing (пропускаем на iOS Safari)
          async () => {
            if (skipZXingOnIOS && isIOSSafari) return null;
            try {
              const { BrowserMultiFormatReader } = await import('@zxing/library');
              const codeReader = new BrowserMultiFormatReader();
              const result = await codeReader.decodeFromImage(img);
              return result?.getText() || null;
            } catch (error) {
              return null;
            }
          },
          // 6. BarcodeDetector API (с полифилом, поддержка aztec/data_matrix)
          async () => {
            if (!('BarcodeDetector' in window)) return null;
            try {
              const detector = new window.BarcodeDetector({ formats: ['qr_code', 'aztec', 'data_matrix'] });
              const barcodes = await detector.detect(img);
              return barcodes.length > 0 ? barcodes[0].rawValue : null;
            } catch (error) {
              return null;
            }
          },
          // 7. jsQR с инвертированными цветами
          async () => {
            const invertedCanvas = document.createElement('canvas');
            const invertedCtx = invertedCanvas.getContext('2d');
            invertedCanvas.width = canvas.width;
            invertedCanvas.height = canvas.height;
            invertedCtx.filter = 'invert(1)';
            invertedCtx.drawImage(canvas, 0, 0);
            const invertedImageData = invertedCtx.getImageData(0, 0, invertedCanvas.width, invertedCanvas.height);
            const code = jsQR(invertedImageData.data, invertedCanvas.width, invertedCanvas.height);
            return code?.data || null;
          },
          // 8. BarcodeDetector (ещё раз, но с форматом all)
          async () => {
            if (!('BarcodeDetector' in window)) return null;
            try {
              const detector = new window.BarcodeDetector({ formats: ['all'] });
              const barcodes = await detector.detect(img);
              return barcodes.length > 0 ? barcodes[0].rawValue : null;
            } catch (error) {
              return null;
            }
          },
          // 9. Бэкенд-резерв (если включен)
          async () => {
            if (!enableBackendFallback || !backendUrl) return null;
            try {
              const formData = new FormData();
              if (imageSource instanceof File) {
                formData.append('image', imageSource);
              } else {
                // Конвертируем dataURL в Blob
                const response = await fetch(imageSource);
                const blob = await response.blob();
                formData.append('image', blob, 'qr-image.jpg');
              }
              const response = await fetch(backendUrl, {
                method: 'POST',
                body: formData
              });
              if (response.ok) {
                const result = await response.json();
                return result.qrCode || result.barcode || null;
              }
            } catch (error) {
              console.warn('[QR] Бэкенд-резерв недоступен:', error);
            }
            return null;
          }
        ];

        // Выполняем попытки
        for (let i = 0; i < Math.min(attempts.length, maxAttempts); i++) {
          try {
            const result = await attempts[i]();
            if (result) {
              console.log(`[QR] Успешно распознан QR-код методом ${i + 1}:`, result);
              resolve(result);
              return;
            }
          } catch (error) {
            console.log(`[QR] Попытка ${i + 1} не удалась:`, error.message);
            continue;
          }
        }

        console.log('[QR] Все методы не смогли распознать QR-код');
        resolve(null);
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Не удалось загрузить изображение'));
    };
    
    // Устанавливаем источник изображения
    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = URL.createObjectURL(imageSource);
    }
  });
};

/**
 * Проверка поддержки различных методов распознавания
 */
export const getQRSupportInfo = () => {
  return {
    isIOS,
    isSafari,
    isIOSSafari,
    hasBarcodeDetector: 'BarcodeDetector' in window,
    hasZXing: true, // Всегда доступен через npm
    hasJsQR: true,  // Всегда доступен через npm
    userAgent: navigator.userAgent
  };
};

/**
 * Оптимизированные настройки камеры для разных платформ
 */
export const getCameraConstraints = () => {
  if (isIOSSafari) {
    return {
      video: {
        facingMode: 'environment',
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 30, max: 60 }
      }
    };
  }
  
  return {
    video: {
      facingMode: 'environment',
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  };
};

/**
 * Создание QR-кода для Сбера (если нужен)
 */
export const createSberQR = (params) => {
  const { token, PayeeINN, Sum, Purpose } = params;
  const baseUrl = 'https://sbqr.ru/OVO/api_png_QR_v2.php';
  const url = new URL(baseUrl);
  
  url.searchParams.append('token', token);
  url.searchParams.append('PayeeINN', PayeeINN);
  if (Sum) url.searchParams.append('Sum', Sum);
  if (Purpose) url.searchParams.append('Purpose', Purpose);
  
  return url.toString();
}; 