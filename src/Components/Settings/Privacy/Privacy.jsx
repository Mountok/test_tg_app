import React, { useState } from 'react';
import Switch from '../../UI/Switch';
import { PiKeyFill } from 'react-icons/pi';
import { IoChevronBackSharp } from 'react-icons/io5';
import './Privacy.css';

const Privacy = ({ onBack }) => {
  const [enabled, setEnabled] = useState(false);

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
        <div className="privacy-item">
          <span className="privacy-icon"><PiKeyFill size={28} color="#fff" /></span>
          <span className="privacy-label">Код-пароль</span>
          <span className="privacy-switch">
            <Switch checked={enabled} onChange={setEnabled} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Privacy;