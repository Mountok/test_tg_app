import React, { useEffect, useState } from 'react'
import './Design.css'
import { IoChevronBackSharp } from 'react-icons/io5';
import { useTheme } from '../../../theme/ThemeProvider';
import { useI18n } from '../../../i18n/I18nProvider';

const Design = ({ onBack }) => {
  const { lang, setLanguage, t } = useI18n();
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    // no-op, just to re-render when theme changes
  }, [resolvedTheme]);

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
      <div className="design-section-label">{t('design.selectLanguage')}</div>
      <div className="design-section">
        <div className={`design-item${lang === 'ru' ? ' selected' : ''}`} onClick={() => setLanguage('ru')}>
          {lang === 'ru' && <span className="design-check">✔</span>}
          <span>Русский</span>
        </div>
        <div className={`design-item${lang === 'en' ? ' selected' : ''}`} onClick={() => setLanguage('en')}>
          {lang === 'en' && <span className="design-check">✔</span>}
          <span>Английский</span>
        </div>
      </div>
      <div className="design-section-label">{t('design.theme')}</div>
      <div className="design-section">
        <div className={`design-item${theme === 'light' ? ' selected' : ''}`} onClick={() => setTheme('light')}>
          {theme === 'light' && <span className="design-check">✔</span>}
          <span>{t('design.theme.light')}</span>
        </div>
        <div className={`design-item${theme === 'dark' ? ' selected' : ''}`} onClick={() => setTheme('dark')}>
          {theme === 'dark' && <span className="design-check">✔</span>}
          <span>{t('design.theme.dark')}</span>
        </div>
        <div className={`design-item${theme === 'system' ? ' selected' : ''}`} onClick={() => setTheme('system')}>
          {theme === 'system' && <span className="design-check">✔</span>}
          <span>{t('design.theme.system')}</span>
        </div>
      </div>
    </div>
  )
}

export default Design