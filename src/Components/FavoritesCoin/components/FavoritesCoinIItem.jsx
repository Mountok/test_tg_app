// src/components/FavoritesCoin/FavoritesCoinItem.jsx
import React from 'react';
import '../FavoritesCoin.css';

const FavoritesCoinItem = ({ icon, name, shortname, price, percent }) => (
  <div className="favorite_coin_item">
    <div className="favorite_coin_item_icon">
      <img src={icon} alt={name} />
    </div>
    <div className="favorite_coin_item_info">
      <p className="favorite_coin_item_name">{name}</p>
      <p className="favorite_coin_item_shortname">{shortname}</p>
    </div>
    <div className="favorite_coin_item_price">
      <p className="favorite_coin_item_price_value">${price}</p>
      <p
        className={`favorite_coin_item_price_percent ${percent >= 0 ? 'up' : 'down'}`}
      >
        {percent >= 0 ? '+' : ''}{percent}%
      </p>
    </div>
  </div>
);

export default FavoritesCoinItem;