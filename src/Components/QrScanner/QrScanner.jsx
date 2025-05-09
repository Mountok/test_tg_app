import { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './QrScanner.css';
import PaymentModal from '../PaymentModal/PaymentModal';
import { ConvertRUBToUSDT } from '../../utils/convert';

const QrScanner = () => {
  const html5QrCodeRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState('none');
  const qrRegionId = 'qr-reader';
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ amountRub: 0, amountUsdt: 0 });
  const startScanner = async () => {
    setScanning(true);
    const html5QrCode = new Html5Qrcode(qrRegionId);
    html5QrCodeRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10 ,qrbox: {width: 250, height: 250}},
        (decodedText) => {
          
          setResult(decodedText);
          console.log(decodedText)

          ConvertRUBToUSDT(decodedText).then(resp => {
            setModalData({ amountRub: resp.amountRub, amountUsdt: resp.amountUsdt }); // сюда передаёшь реальные данные
            setShowModal(true);
            
          }).catch(err => {
            setResult(err)
            
            setModalData({ amountRub: 999, amountUsdt: 1.5471 }); // сюда передаёшь реальные данные
          })
          
          html5QrCode.stop().then(() => html5QrCode.clear());
        }
      );
      
    } catch (err) {
      console.error('Ошибка запуска камеры:', err);
      setScanning(false);
    }
  };

  return (
    <div className="qr-container">
      <PaymentModal
        result={result}
        visible={showModal}
        data={modalData}
        onClose={() => setShowModal(false)}
      />
      <div id="qr-reader" className="qr-camera-wrapper" />

      <div className="qr-overlay">
        <p className="qr-hint">Можно распознать только QR код с платёжных терминалов</p>

        <div className="qr-highlight-box">
          <div className="qr-corner top-left" />
          <div className="qr-corner top-right" />
          <div className="qr-corner bottom-left" />
          <div className="qr-corner bottom-right" />
          <div className="qr-scan-line" />
        </div>
      </div>

      {!scanning && (
        <button className="qr-start-button" onClick={startScanner}>
          Включить камеру
        </button>
      )}

     
    </div>
  );
};

export default QrScanner;