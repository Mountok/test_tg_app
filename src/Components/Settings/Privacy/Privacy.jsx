import React, { useEffect, useState } from 'react';
import Switch from '../../UI/Switch';
import { PiKeyFill } from 'react-icons/pi';
import { IoChevronBackSharp } from 'react-icons/io5';
import './Privacy.css';
import { usePin } from '../../../pin/PinProvider.jsx';

const Privacy = ({ onBack }) => {
  const { envUnavailable, isPinEnabled, isEnabled, setShowSetup, disablePin } = usePin();
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setEnabled(!!isEnabled); }, [isEnabled]);

  return (
    <div className="privacy-container">
      <div className="privacy-header">
        <span className="privacy-back-btn-area">
          <button className="privacy-back-btn" onClick={onBack}>
            <IoChevronBackSharp size={28} />
          </button>
        </span>
        <span className="privacy-title">Настройки</span>
        <span className="privacy-back-btn-area" style={{visibility: 'hidden'}}>
          <IoChevronBackSharp size={28} />
        </span>
      </div>
      <div className="privacy-section-label">Авторизация</div>
      <div className="privacy-section">
        <div className="privacy-item" onClick={() => { if (!enabled && !envUnavailable && !busy) { setShowSetup(true); } }}>
          <span className="privacy-icon"><PiKeyFill size={28} color="#fff" /></span>
          <span className="privacy-label">Код-пароль</span>
          <span className="privacy-switch">
            <Switch
              checked={enabled}
              disabled={envUnavailable || busy}
              onChange={async (next) => {
                if (envUnavailable) return;
                if (next) {
                  // Гарантированно открываем модалку установки PIN
                  setShowSetup(true);
                  return;
                }
                const current = window.prompt('Введите текущий PIN для отключения');
                if (!current) return;
                try {
                  setBusy(true);
                  await disablePin(current);
                } catch (e) {
                  alert(e?.message || 'Неверный PIN');
                } finally {
                  setBusy(false);
                }
              }}
            />
          </span>
        </div>
        {envUnavailable && (
          <div className="privacy-note">PIN недоступен в этом окружении</div>
        )}
      </div>
    </div>
  );
};

export default Privacy;