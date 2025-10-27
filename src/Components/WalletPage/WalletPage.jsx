import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./WalletPage.css";
import { IoNotifications } from "react-icons/io5";
import { BsQrCodeScan } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { CreateWallet, GetBalanceTRX, GetBalanceUSDT, GetWallet } from "../../utils/wallet.js";
import { GoPlus } from "react-icons/go";
import { LuDownload, LuUpload } from "react-icons/lu";
import TransferItem from "../TransferItem/TransferItem.jsx";

import { PiHeadsetFill } from "react-icons/pi";
import PriceCard from "../PriceCard/PriceCard.jsx";
import FavoritesCoin from "../FavoritesCoin/FavoritesCoin.jsx";
import { TelegramInfo } from "../../utils/auth.js";
import { useI18n } from "../../i18n/I18nProvider.jsx";

export default function WalletPage({ username }) {
    const { t } = useI18n();
    const navigateTo = useNavigate();
    const [address, setAddress] = useState();
    const [balance, setBalance] = useState(0);
    const [trxBalance, setTRXBalance] = useState(0);
    const [usdtBalance, setUSDTBalance] = useState(0);
    const [usdtInRub, setUsdtInRub] = useState(0);
    const [idBalanceCreated, setIsBalanceCreated] = useState(false);
    const [privatKeyPlatapay, setPrivatKeyPlatapay] = useState("");

    const [wallet, SetWallet] = useState({})

    // Функция для получения курса USDT к рублю с кэшированием на 5 минут
    const fetchUsdtToRubRate = async () => {
        const cacheKey = 'usdtToRubRate';
        const cacheTimeKey = 'usdtToRubRateTime';
        const now = Date.now();
        const cacheTime = localStorage.getItem(cacheTimeKey);
        if (cacheTime && now - cacheTime < 5 * 60 * 1000) {
            // Используем кэш, если не старше 5 минут
            return parseFloat(localStorage.getItem(cacheKey));
        }
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=rub');
            const data = await response.json();
            const rate = data.tether?.rub || 0;
            localStorage.setItem(cacheKey, rate);
            localStorage.setItem(cacheTimeKey, now);
            return rate;
        } catch (error) {
            // Если ошибка — пробуем вернуть кэш, если есть
            const cached = localStorage.getItem(cacheKey);
            if (cached) return parseFloat(cached);
            return 0;
        }
    };

    // Функция для конвертации USDT в рубли
    const convertUsdtToRub = async (usdtAmount) => {
        const rate = await fetchUsdtToRubRate();
        return (parseFloat(usdtAmount) * rate).toFixed(1);
    };

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
                GetBalanceUSDT(id,addr).then(async (res) => {
                    setUSDTBalance(res.available_balance);
                    // Конвертируем USDT в рубли
                    const rubAmount = await convertUsdtToRub(res.available_balance);
                    setUsdtInRub(rubAmount);
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
                            <p>{t('wallet.greeting')}</p>
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
                                <p><sup className="wallet-container_header_balance_top_address"> {wallet.address} - {usdtBalance}USDT </sup></p>
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
                        <p>{t('wallet.balanceInRubles')}</p>
                        <p>{usdtInRub} ₽</p>
                    </div>
                </div>

                <div className="wallet-container_header_buttons">
                    <button onClick={() => navigateTo("/deposit")} className="wallet-container_header_button_send">
                        <LuDownload />
                        <p>{t('wallet.topUp')}</p>
                    </button>
                    <button onClick={() => navigateTo("/withdraw")} className="wallet-container_header_button_withdraw">
                        <LuUpload />
                        <p>{t('wallet.withdraw') || 'Вывод'}</p>
                    </button>
                    <button onClick={() => navigateTo("/scanner")} className="wallet-container_header_button_qr">
                        <BsQrCodeScan />
                        <p>{t('wallet.payByQR')}</p>
                    </button>
                </div>
            </div>

            <div className="wallet-container_history">
                <div className="favorites-list">
                    <h2>{t('favorites.title')}</h2>
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
