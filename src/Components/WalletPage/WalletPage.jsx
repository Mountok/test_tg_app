import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./WalletPage.css";
import { IoNotifications } from "react-icons/io5";
import { BsQrCodeScan } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { CreateWallet, GetBalanceTRX, GetBalanceUSDT, GetWallet } from "../../utils/wallet.js";
import { GoPlus } from "react-icons/go";
import { LuDownload } from "react-icons/lu";
import TransferItem from "../TransferItem/TransferItem.jsx";

import { PiHeadsetFill } from "react-icons/pi";
import PriceCard from "../PriceCard/PriceCard.jsx";
import FavoritesCoin from "../FavoritesCoin/FavoritesCoin.jsx";
import { TelegramInfo } from "../../utils/auth.js";

export default function WalletPage({ username }) {
    const navigateTo = useNavigate();
    const [address, setAddress] = useState();
    const [balance, setBalance] = useState(0);
    const [trxBalance, setTRXBalance] = useState(0);
    const [usdtBalance, setUSDTBalance] = useState(0);
    const [idBalanceCreated, setIsBalanceCreated] = useState(false);
    const [privatKeyPlatapay, setPrivatKeyPlatapay] = useState("");

    const [wallet, SetWallet] = useState({})
    useEffect(() => {
        // alert("WalletPage useEffect")

        const { id } = TelegramInfo() || {};


        // alert("Telegram ID:", id);

        const loadWalletThenBalance = async (id) => {
            try {

                // 1) Сначала грузим сам кошелёк
                const walletRes = await GetWallet(id);
                const addr = walletRes.data.address;  // сразу берём из ответа
                localStorage.setItem('address_platapay', addr); // сохраняем адрес в localStorage
                SetWallet(walletRes.data);
                setIsBalanceCreated(true);

                // const balanceRes = await GetBalance(id);
                // console.log("Balance response:", balanceRes);

                // if (balanceRes && balanceRes.balances && balanceRes.balances.length > 0) {
                //     // Находим баланс USxDT
                //     const usdtBalance = balanceRes.balances.find(b => b.token_symbol === "USDT");
                //     if (usdtBalance) {
                //         // setUSDTBalance(usdtBalance.amount);
                //         setBalance(usdtBalance.amount);
                //     }
                // }

                // 2) После успешного GetBalanceUSDT — грузим баланс
                GetBalanceUSDT(id,addr).then((res) => {
                    setUSDTBalance(res.available_balance);
                }).catch((err) => {
                    console.log(err)
                })

                GetBalanceTRX(id,addr).then((res) => {
                    setTRXBalance(res.balance);
                }).catch((err) => {
                    console.log(err)
                })


                // адрес обычно хранится в localStorage после создания кошелька
                setAddress(localStorage.getItem('address_platapay'));
            } catch (err) {
                console.error('Ошибка при загрузке кошелька или баланса:', err);
                // Устанавливаем нулевые значения при ошибке
            }
        };

        loadWalletThenBalance(id);
    }, []);



    const handleCreateWallet = async (e, telegramID) => {
        e.preventDefault()
        CreateWallet(telegramID).then(res => {
            setAddress(res.data.address);
            setPrivatKeyPlatapay(res.data.private_key);
            setIsBalanceCreated(true)
            window.location.reload();
        }
        ).catch(err => console.log(err));

    }

    return (
        <div className="wallet-container_main_title">
            <div className="wallet-container_header">
                <div className="wallet-container_header_top">
                    <div className="wallet-container_header_top_user">
                        <div className="wallet-container_header_top_user_name">
                            <p>Добрый день,</p>
                            <p>{username}</p>
                        </div>
                    </div>
                    <div className="wallet-container_header_top_settings">
                        <PiHeadsetFill />
                        <IoNotifications />
                    </div>
                </div>

                <div className="wallet-container_header_balance">
                    <div className="wallet-container_header_balance_top">
                        {idBalanceCreated ?
                            <>
                                <p><span>Мой кошелек <sup>v0.06</sup></span></p>
                                <p><sup className="wallet-container_header_balance_top_address"> {wallet.address} - {trxBalance}TRX </sup></p>
                            </>
                            :
                            null
                            // <p><span>Создать кошелек: </span>
                            //     <div className="wallet-container_header_balance_top_plus" onClick={(e) => { handleCreateWallet(e, telegramID) }}>
                            //         <GoPlus />
                            //     </div>
                            // </p>
                        }
                    </div>
                    <div className="wallet-container_header_balance_bottom">
                        <p>Баланс в USDT</p>
                        <p>{usdtBalance}</p>
                    </div>
                </div>

                <div className="wallet-container_header_buttons">
                    <button onClick={() => navigateTo("/deposit")} className="wallet-container_header_button_send">
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
                <div className="favorites-list">
                    <h2>Избранное</h2>
                    <div className="favorites-cards">
                        <PriceCard
                            coinId="ethereum"
                            title="Ethereum"
                            symbol="ETH"
                            color="#34d399"
                        />
                        <PriceCard
                            coinId="bitcoin"
                            title="Bitcoin"
                            symbol="BTC"
                            color="#f87171"
                        />
                    </div>
                </div>

                <FavoritesCoin />

                {/* <div className="wallet-container_history_title">
                    <p>Последние транзакции</p>
                    <p>Вся история</p>
                </div>
                <div className="wallet-container_main_history">
                    <TransferItem dateTime={"20.01.25"} title={"Магазин"} amount={12.943454} type={"покупка"} />
                    <TransferItem dateTime={"20.01.25"} title={"Магазин"} amount={12.943454} type={"покупка"} />
                    <TransferItem dateTime={"20.01.25"} title={"Магазин"} amount={-12.943454} type={"покупка"} />
                </div> */}
            </div>
        </div>
    );
}
