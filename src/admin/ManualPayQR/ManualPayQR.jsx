import React, { useEffect, useState } from 'react'
import "./ManualPayQR.css"
import PayListItem from './component/PayListItem'
import { IoReloadCircleOutline } from "react-icons/io5";
import { GetOrders } from '../../utils/wallet';

const ManualPayQR = ({telegramID}) => {
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
        <div className="manual_pay_panel">
            <div className="manual_pay_panel-header">
                <h1>Active Orders</h1>
                <IoReloadCircleOutline className='manual_pay_panel-list_reload' />
            </div>
            <div className="manual_pay_panel-body">

                <div className="manual_pay_panel-list">
                    {ordersList.map(el => (
                        <PayListItem key={el.id} order_id={el.id} qr_code={el.qr_code} summa={el.summa} tg_id={el.telegram_id}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ManualPayQR