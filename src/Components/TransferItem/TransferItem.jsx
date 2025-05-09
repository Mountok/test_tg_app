import React from 'react'
import "./TransferItem.css"
const TransferItem = ({date, amount}) => {
  return (
    <div className="wallet-history_transfer">
        <div className="wallet-history_transfer_logo">
            <img src="./public/Vector.svg" alt="#" />
        </div>
        <div className="wallet-history_transfer_title">
            <p>Тут будет история операций</p>
            <p>{date}</p>
        </div>
        <div className="wallet-history_transfer_amount">
            <p>- <span>${amount}</span></p>
            <p>Покупка</p>
        </div>
    </div>
  )
}

export default TransferItem