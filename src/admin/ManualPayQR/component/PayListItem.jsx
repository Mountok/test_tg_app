import React, { useEffect, useState } from 'react'

import "../ManualPayQR.css"
import { GetPrivatKey, PayQR, TransactionTestnet } from '../../../utils/wallet'
const PayListItem = ({order_id,qr_code,summa,telegram_id,crypto}) => {

    const [isPay,setIsPay] = useState(false)
    const [telegramId, setTelegramId ] = useState(telegram_id)
    const [privatKey,setPrivatKey] = useState("")

    useEffect(()=>{
        GetPrivatKey(telegramId).then((res) => {
            console.log(res)
            setPrivatKey(res.key)
        }).catch(err => {
            console.log(res)
        })
    })

    const goTo = (url) => {
        window.open(url,"_blank")
    }

    const isPayed =  (e,orderID) => {
        e.preventDefault()
        console.log(privatKey)

        TransactionTestnet(privatKey,crypto).then(res => {
            console.log(res)
        }).catch(err => {
            return
        }) 


        
        PayQR(orderID).then((resp) => {}).catch(err => {
            console.log(err)
        })
        setIsPay(true)
    }



    return (
        <div className="manual_pay_panel-list_item">
            <p className='manual_pay_panel-list_item_num'>№{order_id}</p>
            <p className='manual_pay_panel-list_item_text'>Сумма: {summa}р. 
                <br />
                USDT: {crypto}
                <br /> 
                TelegramId: {telegram_id}
                </p>
            <div className='manual_pay_panel-list_item_pay_buttons'>
                {isPay ? (
                    <p className='manual_pay_panel-list_item_done'>Оплачен</p>
                ) : (
                <>
                <button onClick={(e) => goTo(qr_code)} className='manual_pay_panel-list_item_pay' >
                    Ссылка
                </button>
                <button onClick={(e) => isPayed(e,order_id,telegramId)} className='manual_pay_panel-list_item_pay'>
                    Готово
                </button>
                </>
                )}  
                
            </div>
        </div>)
}

export default PayListItem