import React from 'react';
import './About.css';
import { useI18n } from '../../../i18n/I18nProvider';

const About = ({ onBack }) => {
    const { t } = useI18n();

    return (
        <div className="about-container">
            <div className="about-header">
                <button className="about-back-btn" onClick={onBack}>&#8592;</button>
                <span className="about-title">{t('about.title')}</span>
            </div>
            <div className="about-content">
                <div className="about-logo">
                    <img src="/images/logo.png" alt="PLATA Pay" className="about-logo-img" />
                </div>
                <div className="about-text">
                    <div className="about-paragraph">
                        {t('about.description1')}
                    </div>
                    <div className="about-paragraph">
                        {t('about.description2')}
                    </div>
                    <div className="about-paragraph">
                        {t('about.mission')}
                    </div>
                    <div className="about-paragraph about-slogan">
                        {t('about.slogan')}
                    </div>
                </div>
                <div className="about-features">
                    <div className="about-feature">
                        <div className="about-feature-icon">⚡</div>
                        <div className="about-feature-text">{t('about.feature1')}</div>
                    </div>
                    <div className="about-feature">
                        <div className="about-feature-icon">🔒</div>
                        <div className="about-feature-text">{t('about.feature2')}</div>
                    </div>
                    <div className="about-feature">
                        <div className="about-feature-icon">🌍</div>
                        <div className="about-feature-text">{t('about.feature3')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
