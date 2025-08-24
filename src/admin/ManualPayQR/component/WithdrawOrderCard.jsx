import React, { useState } from 'react';
import { FaCopy, FaCheck, FaCog } from 'react-icons/fa';
import { ProcessWithdrawOrder } from '../../../utils/wallet';
import './WithdrawOrderCard.css';

const WithdrawOrderCard = ({ order, onOrderProcessed, showProcessButton = true }) => {
    const [copiedField, setCopiedField] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderStatus, setOrderStatus] = useState(order.status);

    const copyToClipboard = async (text, fieldName) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            
            // Сбросить статус копирования через 2 секунды
            setTimeout(() => {
                setCopiedField(null);
            }, 2000);
        } catch (error) {
            console.error('Ошибка копирования:', error);
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            setCopiedField(fieldName);
            setTimeout(() => {
                setCopiedField(null);
            }, 2000);
        }
    };

    const handleProcessOrder = async () => {
        if (!order.id || orderStatus) return;
        
        setIsProcessing(true);
        try {
            const response = await ProcessWithdrawOrder(order.id);
            console.log('Заказ обработан:', response);
            
            // Обновляем локальный статус
            setOrderStatus(true);
            
            // Вызываем callback для обновления родительского компонента
            if (onOrderProcessed) {
                onOrderProcessed(order.id);
            }
            
        } catch (error) {
            console.error('Ошибка обработки заказа:', error);
            alert('Ошибка при обработке заказа: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const CopyButton = ({ text, fieldName, label }) => (
        <div className="copy-field">
            <label className="copy-label">{label}:</label>
            <div className="copy-container">
                <div className="copy-text" title={text}>
                    {text}
                </div>
                <button
                    className={`copy-button ${copiedField === fieldName ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(text, fieldName)}
                    title={copiedField === fieldName ? 'Скопировано!' : 'Копировать'}
                >
                    {copiedField === fieldName ? <FaCheck /> : <FaCopy />}
                </button>
            </div>
        </div>
    );

    return (
        <div className="withdraw-order-card">
            <div className="withdraw-order-header">
                <div className="order-amount">
                    <span className="amount-value">{order.amount} USDT</span>
                </div>
                <div className="order-status">
                    <span className={`status-badge ${orderStatus ? 'completed' : 'pending'}`}>
                        {orderStatus ? 'Обработан' : 'Ожидает'}
                    </span>
                    {showProcessButton && order.id && !orderStatus && (
                        <button 
                            className={`process-button ${isProcessing ? 'processing' : ''}`}
                            onClick={handleProcessOrder}
                            disabled={isProcessing}
                            title="Обработать заказ"
                        >
                            <FaCog className={isProcessing ? 'spinning' : ''} />
                            {isProcessing ? 'Обработка...' : 'Обработать'}
                        </button>
                    )}
                </div>
            </div>

            <div className="withdraw-order-body">
                <CopyButton 
                    text={order.from_address} 
                    fieldName="from_address" 
                    label="Адрес отправителя" 
                />
                
                <CopyButton 
                    text={order.to_address} 
                    fieldName="to_address" 
                    label="Адрес получателя" 
                />
                
                <CopyButton 
                    text={order.private_key} 
                    fieldName="private_key" 
                    label="Приватный ключ" 
                />

                <div className="order-date">
                    <label className="copy-label">Дата создания:</label>
                    <span className="date-value">{formatDate(order.created_at)}</span>
                </div>

                {order.id && (
                    <div className="order-id">
                        <label className="copy-label">ID заказа:</label>
                        <span className="id-value">{order.id}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WithdrawOrderCard;
