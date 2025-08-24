import React, { useState, useEffect } from 'react';
import './ReferralPage.css';
import { useNavigate } from 'react-router-dom';
import { getReferrals, formatDate } from '../../utils/referral';
import { useI18n } from '../../i18n/I18nProvider.jsx';

const ReferralListPage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [referrals, setReferrals] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    fetchReferrals();
  }, [currentPage, currentFilter]);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const data = await getReferrals(currentPage, 20, currentFilter);
      setReferrals(data.results);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge status-${status}`}>
        {status === 'active' ? 'Активный' : 'Неактивный'}
      </span>
    );
  };



  if (loading && currentPage === 1) {
    return (
      <div className="referral-page">
        <div className="referral-header">
          <button className="referral-back-btn" onClick={() => navigate('/referral')}>
            &#8592;
          </button>
          <span className="referral-title">{t('referral.myReferrals') || 'Мои рефералы'}</span>
        </div>
        <div className="referral-loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="referral-page">
        <div className="referral-header">
          <button className="referral-back-btn" onClick={() => navigate('/referral')}>
            &#8592;
          </button>
          <span className="referral-title">{t('referral.myReferrals') || 'Мои рефералы'}</span>
        </div>
        <div className="referral-error">
          <p>Ошибка: {error}</p>
          <button onClick={fetchReferrals} className="retry-btn">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="referral-page">
      <div className="referral-header">
        <button className="referral-back-btn" onClick={() => navigate('/referral')}>
          &#8592;
        </button>
        <span className="referral-title">Мои рефералы</span>
      </div>
      
      {/* Фильтры */}
        <div className="filters">
        <button 
          className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => {
            setCurrentFilter('all');
            setCurrentPage(1);
          }}
        >
          {t('referral.all') || 'Все'}
        </button>
        <button 
          className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
          onClick={() => {
            setCurrentFilter('active');
            setCurrentPage(1);
          }}
        >
          {t('referral.activeShort') || 'Активные'}
        </button>
        <button 
          className={`filter-btn ${currentFilter === 'inactive' ? 'active' : ''}`}
          onClick={() => {
            setCurrentFilter('inactive');
            setCurrentPage(1);
          }}
        >
          {t('referral.inactiveShort') || 'Неактивные'}
        </button>
      </div>

      {/* Статистика */}
      <div className="referrals-summary">
        <div className="summary-item">
          <span className="summary-label">{t('referral.total') || 'Всего рефералов:'}</span>
          <span className="summary-value">{pagination.total_results || 0}</span>
        </div>
      </div>

      {/* Список рефералов */}
      {referrals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>{t('referral.empty') || 'У вас пока нет рефералов'}</h3>
            <p>{t('referral.shareHint') || 'Поделитесь своей реферальной ссылкой с друзьями, чтобы начать зарабатывать!'}</p>
          <button onClick={() => navigate('/referral')} className="btn-primary">
            {t('referral.backToProgram') || 'Вернуться к реферальной программе'}
          </button>
        </div>
      ) : (
        <div className="referrals-list">
          {referrals.map(referral => (
            <div key={referral.id} className="referral-item">
              <div className="referral-item-header">
                <span className="referral-id">{referral.display_id}</span>
                {getStatusBadge(referral.status)}
              </div>
              <div className="referral-item-date">
                {t('referral.registerDate') || 'Дата регистрации'}: {formatDate(referral.registration_date)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Пагинация */}
      {pagination.total_pages > 1 && (
        <div className="pagination">
            <button 
            className="pagination-btn"
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            {t('common.back') || 'Назад'}
          </button>
          
          <span className="page-info">{currentPage} {t('common.of') || 'из'} {pagination.total_pages}</span>
          
            <button 
            className="pagination-btn"
            disabled={currentPage === pagination.total_pages || loading}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            {t('common.next') || 'Вперед'}
          </button>
        </div>
      )}

      {loading && currentPage > 1 && (
        <div className="pagination-loading">{t('common.loading') || 'Загрузка...'}</div>
      )}
    </div>
  );
};

export default ReferralListPage;