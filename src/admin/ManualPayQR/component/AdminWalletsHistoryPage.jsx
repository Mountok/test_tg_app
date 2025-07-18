import React, { useEffect, useState } from 'react';
import './AdminWalletsHistoryPage.css';
import { GetAdminWalletsWithHistory } from '../../../utils/wallet';

const typeOptions = [
  { value: '', label: 'Все типы' },
  { value: 'virtual', label: 'Виртуальные' },
  { value: 'real', label: 'Реальные' },
];
const statusOptions = [
  { value: '', label: 'Все статусы' },
  { value: 'pending', label: 'Ожидает' },
  { value: 'processed', label: 'Обработан' },
  { value: 'success', label: 'Успешно' },
];

const AdminWalletsHistoryPage = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openWallet, setOpenWallet] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [adminSecret, setAdminSecret] = useState('');

  useEffect(() => {
    if (!adminSecret) {
      const key = window.prompt('Введите секретный ключ для доступа к истории кошельков:');
      if (!key) return;
      setAdminSecret(key);
    }
  }, [adminSecret]);

  useEffect(() => {
    if (!adminSecret) return;
    setLoading(true);
    GetAdminWalletsWithHistory(adminSecret)
      .then(data => {
        setWallets(data);
        console.log('wallets:', data);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [adminSecret]);

  const filteredHistory = (history) =>
    (history || []).filter(item =>
      (typeFilter ? item.type === typeFilter : true) &&
      (statusFilter ? item.status === statusFilter : true)
    );

  const totalAmount = (history) =>
    filteredHistory(history).reduce((sum, item) => sum + (item.amount || 0), 0);

  if (!adminSecret) return <div style={{ padding: 24 }}>Нет доступа: не введён секретный ключ.</div>;
  if (loading) return <div style={{ padding: 24 }}>Загрузка...</div>;
  if (error) return <div style={{ color: 'red', padding: 24 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2>История по кошелькам</h2>
      {wallets.length === 0 && <div>Нет кошельков</div>}
      {wallets.map(wallet => (
        <div key={wallet.wallet_id} style={{ border: '1px solid #eee', borderRadius: 10, marginBottom: 18, background: '#fafbfc' }}>
          <div
            style={{ cursor: 'pointer', padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onClick={() => setOpenWallet(openWallet === wallet.wallet_id ? null : wallet.wallet_id)}
          >
            <span>
              <b style={{ color: 'black' }}>{wallet.address}</b> (user_id: {wallet.user_id})
            </span>
            <span style={{ fontSize: 13, color: '#888' }}>ID: {wallet.wallet_id}</span>
          </div>
          {openWallet === wallet.wallet_id && (
            <div style={{ padding: 14, borderTop: '1px solid #eee', background: '#fff' }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <table className="admin-wallets-history-table" style={{ width: '100%', fontSize: 15, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f3f3f3', color: 'black' }}>
                    <th style={{ textAlign: 'left', padding: 6 }}>ID</th>
                    <th>Сумма</th>
                    <th>Тип</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Куда</th>
                    <th>TxHash</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory(wallet.history || []).map((item, idx) => (
                    <tr key={item.id + '-' + idx}>
                      <td style={{ padding: 6 }}>{item.id}</td>
                      <td>{item.amount}</td>
                      <td>{item.type}</td>
                      <td>{item.status}</td>
                      <td>{item.created_at?.slice(0, 19).replace('T', ' ')}</td>
                      <td>{item.to_address || '-'}</td>
                      <td style={{ fontSize: 12 }}>{item.tx_hash || '-'}</td>
                    </tr>
                  ))}
                  {filteredHistory(wallet.history || []).length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: '#aaa', padding: 12 }}>Нет операций</td></tr>
                  )}
                </tbody>
              </table>
              <div style={{ marginTop: 12, fontWeight: 500 }}>
                Итого по фильтру: {totalAmount(wallet.history)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminWalletsHistoryPage; 