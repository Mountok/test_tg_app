import { useState } from "react";
import { ethers } from "ethers";
import "./WalletPage.css";

export default function WalletPage() {
    const [address, setAddress] = useState(null);
    const [balance, setBalance] = useState("0");


    return (
        <div className="wallet-container">
            <h1 className="wallet-title">🪙 Ваш кошелек</h1>

            <div className="wallet-info">
                <p><strong>👤 Адрес:</strong> {address || "Не подключен"}</p>
                <p><strong>💰 Баланс USDT:</strong> {balance}</p>
            </div>
        </div>
    );
}
