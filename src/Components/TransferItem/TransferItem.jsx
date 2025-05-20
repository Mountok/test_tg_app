// src/Components/TransferItem/TransferItem.jsx
import React from 'react';
import './TransferItem.css';
// Подставь свой логотип или передавай через проп iconSrc
import DefaultIcon from '/images/Vector.svg';
import { BsArrowDownLeftCircle,BsArrowUpRightCircle } from "react-icons/bs";

export default function TransferItem({
  title,
  dateTime,
  status,
  amount,
  type,
  iconSrc,
}) {
  const isNegative = amount < 0;
  return (
    <div className="transfer-item">
      <div className="transfer-item-left">
        <img
          src={DefaultIcon}
          alt=""
          className="transfer-item-icon"
        />
        {amount > 0 ? <BsArrowUpRightCircle className='transfer-item-icon_svg'/> : <BsArrowDownLeftCircle className='transfer-item-icon_svg'/>}
        
        <div className="transfer-item-info">
          <p className="transfer-item-title">{title}</p>
          <p className="transfer-item-date">{dateTime}</p>
          {status && (
            <p className="transfer-item-status">{status}</p>
          )}
        </div>
      </div>
      <div className="transfer-item-right">
        <p
          className={
            'transfer-item-amount ' +
            (isNegative ? 'negative' : 'positive')
          }
        >
          {isNegative ? '- ' : '+ '}
          ${Math.abs(amount).toFixed(2)}
        </p>
        {type && (
          <p className="transfer-item-type">{type}</p>
        )}
      </div>
    </div>
  );
}