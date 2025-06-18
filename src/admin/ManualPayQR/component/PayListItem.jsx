import React, { useState } from 'react'

import "../ManualPayQR.css"
import { PayQR } from '../../../utils/wallet'
const PayListItem = ({order_id,qr_code,summa,tg_id}) => {

    const [isPay,setIsPay] = useState(false)

    const goTo = (url) => {
        window.open(url,"_blank")
    }

    const isPayed = (e,orderID) => {
        e.preventDefault()
        PayQR(orderID).then((resp) => {}).catch(err => {
            console.log(err)
        })
        setIsPay(true)
    }



    return (
        <div className="manual_pay_panel-list_item">
            <p className='manual_pay_panel-list_item_num'>№{order_id}</p>
            <p className='manual_pay_panel-list_item_text'>Сумма: {summa}р. <br /> TelegramId: {tg_id}</p>
            <div className='manual_pay_panel-list_item_pay_buttons'>
                {isPay ? (
                    <p className='manual_pay_panel-list_item_done'>Оплачен</p>
                ) : (
                <>
                <button onClick={(e) => goTo(qr_code)} className='manual_pay_panel-list_item_pay' >
                    Ссылка
                </button>
                <button onClick={(e) => isPayed(e,order_id)} className='manual_pay_panel-list_item_pay'>
                    Готово
                </button>
                </>
                )}  
                
            </div>
        </div>)
}

export default PayListItem