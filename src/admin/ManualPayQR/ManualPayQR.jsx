import React, { useEffect, useState } from 'react'
import "./ManualPayQR.css"
import PayListItem from './component/PayListItem'
import { IoReloadCircleOutline } from "react-icons/io5";
import { GetOrders } from '../../utils/wallet';
import { Routes, Route, Link } from 'react-router-dom';
import AdminWalletsHistoryPage from './component/AdminWalletsHistoryPage';

const ManualPayQR = () => {
    const [ordersList, setOrdersList] = useState([])
    const [isReload, setIsReload] = useState(false)

    useEffect(() => {
        const fetchOrders = () => {
            GetOrders().then(resp => {
                console.log(resp.data)
                if (resp.data.message === "no orders found") {
                    setOrdersList([])
                } else {
                    setOrdersList(resp.data)
                }
            }).catch((err) => {
                setOrdersList([])
                console.log(err)
            })
        }

        // Initial fetch
        fetchOrders()

        // Set up interval to fetch every 5 seconds
        const intervalId = setInterval(fetchOrders, 5000)

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId)
    }, [isReload])



    return (
        <div>
            <nav style={{ marginBottom: 18 }}>
                <Link to="/x7k9m2p8/wallets-history" style={{ marginRight: 16 }}>История по кошелькам</Link>
                <Link to="/x7k9m2p8/withdraw-orders" style={{ marginRight: 16 }}>Заказы на вывод</Link>
                <Link to="/x7k9m2p8/withdraw-history" style={{ marginRight: 16 }}>История выводов</Link>
                {/* другие ссылки, если есть */}
            </nav>
            <Routes>
                <Route path="/x7k9m2p8/wallets-history" element={<AdminWalletsHistoryPage />} />
                {/* другие роуты, если есть */}
            </Routes>
            <div className="manual_pay_panel">
                <div className="manual_pay_panel-header">
                    <h1>Active Orders</h1>
                    <IoReloadCircleOutline className='manual_pay_panel-list_reload' />
                </div>
                <div className="manual_pay_panel-body">

                    <div className="manual_pay_panel-list">
                        {ordersList.map(el => (
                            <PayListItem crypto={el.crypto} key={el.id} order_id={el.id} qr_code={el.qr_code} summa={el.summa} telegram_id={el.telegram_id}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManualPayQR