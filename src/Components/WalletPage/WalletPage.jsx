import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./WalletPage.css";
import { IoNotifications } from "react-icons/io5";
import { BsQrCodeScan } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { CreateWallet, GetBalance } from "../../utils/wallet.js";
import { GoPlus } from "react-icons/go";
import { LuDownload } from "react-icons/lu";
import TransferItem from "../TransferItem/TransferItem.jsx";

// 🧩 Добавляем Telegram SDK
import { init, miniApp } from "@telegram-apps/sdk";

export default function WalletPage() {
    const [username, setUsername] = useState("Islam");
    const [telegramId, setTelegramId] = useState(null);
    const navigateTo = useNavigate();
    const [address, setAddress] = useState();
    const [balance, setBalance] = useState();
    const [idBalanceCreated, setIsBalanceCreated] = useState(false);

    useEffect(() => {
        // Инициализация Telegram SDK
        const initializeTelegram = async () => {
            try {
                await init();

                const user = miniApp.initDataUnsafe?.user;

                if (user) {
                    const id = user.id;
                    const name = user.username || user.first_name || "Неизвестный";

                    localStorage.setItem("telegramId", id.toString());
                    localStorage.setItem("nickname", name);

                    setTelegramId(id);
                    setUsername(name);

                    alert(name)

                    console.log("Telegram user loaded:", id, name);
                } else {
                    alert("Данные пользователя Telegram не найдены")

                    console.warn("Данные пользователя Telegram не найдены");
                }

            } catch (error) {
                console.error("Ошибка инициализации Telegram:", error);
            }
        };

        initializeTelegram();
    }, []);

    useEffect(() => {
        GetBalance().then(res => {
            if (res.balances == null) {
                console.log("Кошелек не создан");
                setIsBalanceCreated(false);
            } else {
                console.log("Кошелек создан");
                setIsBalanceCreated(true);
                setAddress(localStorage.getItem("address_platapay"));
                setBalance(res.balances);
            }
        }).catch(err => console.log(err));
    }, []);

    const handleBalanceCreate = () => {
        CreateWallet().then(res => {
            console.log(res.data);
            localStorage.setItem("address_platapay", res.data.address);
            localStorage.setItem("privat_key_platapay", res.data.private_key);
            window.location.reload();
        }).catch(err => console.log(err));
    };

    return (
        <div className="wallet-container_main_title">
            <div className="wallet-container_header">
                <div className="wallet-container_header_top">
                    <div className="wallet-container_header_top_user">
                        <div className="wallet-container_header_top_user_name">
                            <p>Добрый день,</p>
                            <p>{username} {telegramId}</p>
                        </div>
                    </div>
                    <div className="wallet-container_header_top_settings">
                        <IoNotifications />
                    </div>
                </div>

                <div className="wallet-container_header_balance">
                    <div className="wallet-container_header_balance_top">
                        {idBalanceCreated ?
                            <p><span>Мой кошелек {address} </span></p>
                            :
                            <p><span>Создать кошелек: </span>
                                <div className="wallet-container_header_balance_top_plus" onClick={handleBalanceCreate}>
                                    <GoPlus />
                                </div>
                            </p>
                        }
                    </div>
                    <div className="wallet-container_header_balance_bottom">
                        <p>Баланс в USDT</p>
                        <p>{balance ? `$${balance}` : "$0.0"}</p>
                    </div>
                </div>

                <div className="wallet-container_header_buttons">
                    <button className="wallet-container_header_button_send">
                        <LuDownload />
                        <p>Пополнить</p>
                    </button>
                    <button onClick={() => navigateTo("/scanner")} className="wallet-container_header_button_qr">
                        <BsQrCodeScan />
                        <p>Оплатить по QR</p>
                    </button>
                </div>
            </div>

            <div className="wallet-container_history">
                <div className="wallet-container_history_title">
                    <p>Последние транзакции</p>
                    <p>Вся история</p>
                </div>
                <div className="wallet-container_main_history">
                    <TransferItem date={"20.01.25"} amount={100} />
                    <TransferItem date={"20.01.25"} amount={100} />
                </div>
            </div>
        </div>
    );
}
