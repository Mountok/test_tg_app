import React, { useEffect, useState } from 'react';
import { IoReloadCircleOutline } from "react-icons/io5";
import { GetWithdrawWaitingList } from '../../../utils/wallet';
import WithdrawOrderCard from './WithdrawOrderCard';
import './AdminWithdrawOrdersPage.css';

const AdminWithdrawOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await GetWithdrawWaitingList();
            console.log('Ответ API:', response);
            
            if (response && response.data) {
                setOrders(response.data);
                setLastUpdate(new Date());
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error('Ошибка загрузки заказов на вывод:', err);
            setError('Ошибка загрузки данных. Проверьте подключение к серверу.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Загружаем данные при монтировании компонента
        fetchOrders();

        // Автообновление каждые 10 секунд
        const intervalId = setInterval(fetchOrders, 10000);

        // Очистка интервала при размонтировании
        return () => clearInterval(intervalId);
    }, []);

    const handleManualRefresh = () => {
        fetchOrders();
    };

    const handleOrderProcessed = (orderId) => {
        // Обновляем статус заказа в локальном состоянии
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId 
                    ? { ...order, status: true }
                    : order
            )
        );
        
        // Можно также обновить данные с сервера через некоторое время
        setTimeout(() => {
            fetchOrders();
        }, 1000);
    };

    const formatLastUpdate = () => {
        if (!lastUpdate) return '';
        return lastUpdate.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="admin-withdraw-orders-container">
            <div className="admin-withdraw-orders-header">
                <div className="header-left">
                    <h1>Заказы на вывод</h1>
                    {lastUpdate && (
                        <span className="last-update">
                            Обновлено: {formatLastUpdate()}
                        </span>
                    )}
                </div>
                <button 
                    className={`refresh-button ${loading ? 'loading' : ''}`}
                    onClick={handleManualRefresh}
                    disabled={loading}
                    title="Обновить список"
                >
                    <IoReloadCircleOutline className={`refresh-icon ${loading ? 'spinning' : ''}`} />
                </button>
            </div>

            <div className="orders-stats">
                <div className="stat-item">
                    <span className="stat-label">Всего заказов:</span>
                    <span className="stat-value">{orders.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Ожидает обработки:</span>
                    <span className="stat-value pending">
                        {orders.filter(order => !order.status).length}
                    </span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Обработано:</span>
                    <span className="stat-value completed">
                        {orders.filter(order => order.status).length}
                    </span>
                </div>
            </div>

            <div className="admin-withdraw-orders-body">
                {error && (
                    <div className="error-message">
                        <span>{error}</span>
                        <button onClick={handleManualRefresh} className="retry-button">
                            Повторить
                        </button>
                    </div>
                )}

                {loading && orders.length === 0 && (
                    <div className="loading-message">
                        <div className="loading-spinner"></div>
                        <span>Загрузка заказов...</span>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="empty-message">
                        <h3>Заказы на вывод не найдены</h3>
                        <p>На данный момент нет ожидающих обработки заказов на вывод средств.</p>
                    </div>
                )}

                {orders.length > 0 && (
                    <div className="orders-list">
                        {orders.map((order, index) => (
                            <WithdrawOrderCard 
                                key={`${order.from_address}-${order.created_at}-${index}`} 
                                order={order}
                                onOrderProcessed={handleOrderProcessed}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminWithdrawOrdersPage;
