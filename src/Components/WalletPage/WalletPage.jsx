import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./WalletPage.css";
import { IoNotifications } from "react-icons/io5";
import { BsQrCodeScan } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { CreateWallet, GetBalance, GetWallet } from "../../utils/wallet.js";
import { GoPlus } from "react-icons/go";
import { LuDownload } from "react-icons/lu";
import TransferItem from "../TransferItem/TransferItem.jsx";


export default function WalletPage({ username, telegramID }) {
    const navigateTo = useNavigate();
    const [tgID, SetTgID] = useState(telegramID)
    const [address, setAddress] = useState();
    const [balance, setBalance] = useState();
    const [usdtBalance, setUSDTBalance] = useState();
    const [idBalanceCreated, setIsBalanceCreated] = useState(false);
    const [privatKeyPlatapay, setPrivatKeyPlatapay] = useState("");

    const [wallet, SetWallet] = useState({})
    useEffect(() => {
        // Ждём, пока у вас появятся оба ID
        if (!tgID || !telegramID) return;

        const loadWalletThenBalance = async () => {
            try {
                // 1) Сначала грузим сам кошелёк
                const walletRes = await GetWallet(tgID);
                SetWallet(walletRes.data);
                setIsBalanceCreated(true);

                // 2) После успешного GetWallet — грузим баланс
                const balanceRes = await GetBalance(telegramID);
                const bal = balanceRes.wallet_balance;
                const usdt = balanceRes.ton;

                // alert("bal = ", JSON.stringify(bal))
                // alert("usdt = ", JSON.stringify(usdt))

                if (bal != null) {
                    setBalance(bal);
                    setUSDTBalance(usdt)
                    // адрес обычно хранится в localStorage после создания кошелька
                    setAddress(localStorage.getItem('address_platapay'));
                } else {
                    // если баланса нет — считается, что кошелька нет
                    setIsBalanceCreated(false);
                }
            } catch (err) {
                console.error('Ошибка при загрузке кошелька или баланса:', err);
                // alert('Ошибка при загрузке кошелька или баланса:', JSON.stringify(err))
                // здесь можно уведомить пользователя через alert или стейт
            }
        };

        loadWalletThenBalance();
    }, [tgID, telegramID]);



    const handleCreateWallet = async (e, telegramID) => {
        e.preventDefault()
        CreateWallet(telegramID).then(res => {
            console.log(res.data);
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
                        <IoNotifications />
                    </div>
                </div>

                <div className="wallet-container_header_balance">
                    <div className="wallet-container_header_balance_top">
                        {idBalanceCreated ?
                            <p><span>Мой кошелек</span><sup className="wallet-container_header_balance_top_address"> {wallet.address} </sup></p>
                            :
                            <p><span>Создать кошелек: </span>
                                <div className="wallet-container_header_balance_top_plus" onClick={(e) => { handleCreateWallet(e, telegramID) }}>
                                    <GoPlus />
                                </div>
                            </p>
                        }
                    </div>
                    <div className="wallet-container_header_balance_bottom">
                        <p>Баланс в USDT</p>
                        <p>{balance ? `$${usdtBalance}` : "0.0"}</p>
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
                </div>
            </div>
        </div>
    );
}
