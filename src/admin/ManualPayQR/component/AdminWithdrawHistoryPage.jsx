import React, { useEffect, useState } from 'react';
import { IoReloadCircleOutline, IoFilterSharp } from "react-icons/io5";
import { GetWithdrawHistory } from '../../../utils/wallet';
import WithdrawOrderCard from './WithdrawOrderCard';
import './AdminWithdrawHistoryPage.css';

const AdminWithdrawHistoryPage = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', 'pending'

    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await GetWithdrawHistory();
            console.log('История заказов на вывод:', response);
            
            if (response && response.data) {
                setAllOrders(response.data);
                setLastUpdate(new Date());
            } else {
                setAllOrders([]);
            }
        } catch (err) {
            console.error('Ошибка загрузки истории заказов на вывод:', err);
            setError('Ошибка загрузки данных. Проверьте подключение к серверу.');
            setAllOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Загружаем данные при монтировании компонента
        fetchHistory();

        // Автообновление каждые 30 секунд (для истории реже)
        const intervalId = setInterval(fetchHistory, 30000);

        // Очистка интервала при размонтировании
        return () => clearInterval(intervalId);
    }, []);

    // Фильтрация заказов при изменении фильтра или данных
    useEffect(() => {
        let filtered = allOrders;
        
        switch (statusFilter) {
            case 'completed':
                filtered = allOrders.filter(order => order.status === true);
                break;
            case 'pending':
                filtered = allOrders.filter(order => order.status === false);
                break;
            default:
                filtered = allOrders;
        }
        
        // Сортировка по дате создания (новые сверху)
        filtered = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setFilteredOrders(filtered);
    }, [allOrders, statusFilter]);

    const handleManualRefresh = () => {
        fetchHistory();
    };

    const handleFilterChange = (newFilter) => {
        setStatusFilter(newFilter);
    };

    const formatLastUpdate = () => {
        if (!lastUpdate) return '';
        return lastUpdate.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getFilterStats = () => {
        const total = allOrders.length;
        const completed = allOrders.filter(order => order.status === true).length;
        const pending = allOrders.filter(order => order.status === false).length;
        return { total, completed, pending };
    };

    const stats = getFilterStats();

    return (
        <div className="admin-withdraw-history-container">
            <div className="admin-withdraw-history-header">
                <div className="header-left">
                    <h1>История заказов на вывод</h1>
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
                    title="Обновить историю"
                >
                    <IoReloadCircleOutline className={`refresh-icon ${loading ? 'spinning' : ''}`} />
                </button>
            </div>

            <div className="filter-section">
                <div className="filter-header">
                    <IoFilterSharp className="filter-icon" />
                    <span>Фильтр по статусу:</span>
                </div>
                <div className="filter-buttons">
                    <button 
                        className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('all')}
                    >
                        Все ({stats.total})
                    </button>
                    <button 
                        className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('completed')}
                    >
                        Обработанные ({stats.completed})
                    </button>
                    <button 
                        className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('pending')}
                    >
                        Ожидающие ({stats.pending})
                    </button>
                </div>
            </div>

            <div className="history-stats">
                <div className="stat-item">
                    <span className="stat-label">Показано заказов:</span>
                    <span className="stat-value">{filteredOrders.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Всего в истории:</span>
                    <span className="stat-value">{stats.total}</span>
                </div>
            </div>

            <div className="admin-withdraw-history-body">
                {error && (
                    <div className="error-message">
                        <span>{error}</span>
                        <button onClick={handleManualRefresh} className="retry-button">
                            Повторить
                        </button>
                    </div>
                )}

                {loading && allOrders.length === 0 && (
                    <div className="loading-message">
                        <div className="loading-spinner"></div>
                        <span>Загрузка истории...</span>
                    </div>
                )}

                {!loading && !error && filteredOrders.length === 0 && allOrders.length === 0 && (
                    <div className="empty-message">
                        <h3>История заказов пуста</h3>
                        <p>На данный момент нет заказов на вывод средств в истории.</p>
                    </div>
                )}

                {!loading && !error && filteredOrders.length === 0 && allOrders.length > 0 && (
                    <div className="empty-message">
                        <h3>Нет заказов по выбранному фильтру</h3>
                        <p>Попробуйте изменить фильтр для просмотра других заказов.</p>
                    </div>
                )}

                {filteredOrders.length > 0 && (
                    <div className="orders-list">
                        {filteredOrders.map((order, index) => (
                            <WithdrawOrderCard 
                                key={`${order.id}-${order.created_at}-${index}`} 
                                order={order}
                                showProcessButton={false} // В истории не показываем кнопку обработки
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminWithdrawHistoryPage;
