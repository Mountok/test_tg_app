import React from 'react';
import './FAQ.css';
import { useI18n } from '../../../i18n/I18nProvider';

const FAQ = ({ onBack }) => {
    const { t } = useI18n();

    const faqItems = [
        {
            question: t('faq.question1'),
            answer: t('faq.answer1')
        },
        {
            question: t('faq.question2'),
            answer: t('faq.answer2')
        },
        {
            question: t('faq.question3'),
            answer: t('faq.answer3')
        },
        {
            question: t('faq.question4'),
            answer: t('faq.answer4')
        },
        {
            question: t('faq.question5'),
            answer: t('faq.answer5')
        },
        {
            question: t('faq.question6'),
            answer: t('faq.answer6')
        },
        {
            question: t('faq.question7'),
            answer: t('faq.answer7')
        },
        {
            question: t('faq.question8'),
            answer: t('faq.answer8')
        },
        {
            question: t('faq.question9'),
            answer: t('faq.answer9')
        },
        {
            question: t('faq.question10'),
            answer: t('faq.answer10')
        }
    ];

    return (
        <div className="faq-container">
            <div className="faq-header">
                <button className="faq-back-btn" onClick={onBack}>&#8592;</button>
                <span className="faq-title">{t('faq.title')}</span>
            </div>
            <div className="faq-content">
                <div className="faq-items">
                    {faqItems.map((item, index) => (
                        <div key={index} className="faq-item">
                            <div className="faq-question">
                                <span className="faq-question-number">{index + 1}.</span>
                                <span className="faq-question-text">{item.question}</span>
                            </div>
                            <div className="faq-answer">
                                {item.answer.split('\n').map((line, lineIndex) => {
                                    // Handle numbered list items
                                    if (line.trim().match(/^\d+\./)) {
                                        return (
                                            <div key={lineIndex} className="faq-answer-list-item">
                                                {line.trim()}
                                            </div>
                                        );
                                    }
                                    // Handle regular paragraphs
                                    return line.trim() ? (
                                        <p key={lineIndex} className="faq-answer-paragraph">
                                            {line.trim()}
                                        </p>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="faq-contact">
                    <div className="faq-contact-title">{t('faq.contactTitle')}</div>
                    <div className="faq-contact-info">
                        <div className="faq-contact-item">
                            📩 platapay@mail.ru
                        </div>
                        <div className="faq-contact-item">
                            Telegram: @Platapay_support_bot
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
