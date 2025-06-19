import React, { useState } from 'react'
import './Design.css'
import { IoChevronBackSharp } from 'react-icons/io5';

const Design = ({ onBack }) => {
  const [lang, setLang] = useState('ru')
  const [theme, setTheme] = useState('dark')

  return (
    <div className="design-container">
      <div className="design-header">
        <span className="design-back-btn-area">
          <button className="design-back-btn" onClick={onBack}>
            <IoChevronBackSharp size={28} />
          </button>
        </span>
        <span className="design-title">Настройки</span>
        <span className="design-back-btn-area" style={{visibility: 'hidden'}}>
          {/* Для симметрии, чтобы заголовок всегда был по центру */}
          <IoChevronBackSharp size={28} />
        </span>
      </div>
      <div className="design-section-label">Выберите язык</div>
      <div className="design-section">
        <div className={`design-item${lang === 'ru' ? ' selected' : ''}`} onClick={() => setLang('ru')}>
          {lang === 'ru' && <span className="design-check">✔</span>}
          <span>Русский</span>
        </div>
        <div className={`design-item${lang === 'en' ? ' selected' : ''}`} onClick={() => setLang('en')}>
          {lang === 'en' && <span className="design-check">✔</span>}
          <span>Английский</span>
        </div>
      </div>
      <div className="design-section-label">Тема</div>
      <div className="design-section">
        <div className={`design-item${theme === 'light' ? ' selected' : ''}`} onClick={() => setTheme('light')}>
          {theme === 'light' && <span className="design-check">✔</span>}
          <span>Светлая</span>
        </div>
        <div className={`design-item${theme === 'dark' ? ' selected' : ''}`} onClick={() => setTheme('dark')}>
          {theme === 'dark' && <span className="design-check">✔</span>}
          <span>Тёмная</span>
        </div>
        <div className={`design-item${theme === 'system' ? ' selected' : ''}`} onClick={() => setTheme('system')}>
          {theme === 'system' && <span className="design-check">✔</span>}
          <span>Как в системе</span>
        </div>
      </div>
    </div>
  )
}

export default Design