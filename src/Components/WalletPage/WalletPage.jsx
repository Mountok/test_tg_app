import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./WalletPage.css";
import { IoNotifications } from "react-icons/io5";
import { BsQrCodeScan } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import {CreateWallet, GetBalance} from "../../utils/wallet.js";
import { GoPlus } from "react-icons/go";
import { LuDownload } from "react-icons/lu";
import TransferItem from "../TransferItem/TransferItem.jsx";

export default function WalletPage() {
    const [username, setUsername] = useState("Islam");
    const navigateTo = useNavigate();
    const [address, setAddress] = useState();
    const [balance, setBalance] = useState();
    const [idBalanceCreated, setIsBalanceCreated] = useState(false);


    useEffect(() => {
        GetBalance().then(res => {
            if (res.balances == null) {
                console.log("Кощелек не создан")
                setIsBalanceCreated(false)
            } else {
                console.log("Кощелек создан")
                setIsBalanceCreated(true)
                setAddress(localStorage.getItem("address_platapay"))
                console.log(res.balances);
                setBalance(res.balances);
            }
        }).catch(err => console.log(err));
    }, [])

    const handleBalanceCreate =  () => {
        CreateWallet().then(res => {
            console.log(res.data)
            localStorage.setItem("address_platapay", res.data.address)
            localStorage.setItem("privat_key_platapay", res.data.private_key)
            window.location.reload();
        }).catch(err => console.log(err));
    }



    return (
        <div className="wallet-container_main_title">
            <div className="wallet-container_header">
                <div className="wallet-container_header_top">
                    <div className="wallet-container_header_top_user">
                       
                        <div className="wallet-container_header_top_user_name">
                            <p>Дорый день,</p>
                            <p>{localStorage.getItem("nickname")} {localStorage.getItem("telegramId")}</p>
                        </div>
                    </div> 
                    <div className="wallet-container_header_top_settings">
                        <IoNotifications />
                    </div>
                </div>
                <div className="wallet-container_header_balance">
                    <div className="wallet-container_header_balance_top">
                        {idBalanceCreated ?
                            <p><span>Мой кощелек {address} </span></p>
                            :
                            <p><span>Создать кощелек: </span>
                            {/* <span style={{cursor:"pointer"}} onClick={handleBalanceCreate}>Создать счет</span> */}
                            <div className="wallet-container_header_balance_top_plus">
                                <GoPlus />
                            </div>  
                            </p>
                        }
                    </div>
                    <div className="wallet-container_header_balance_bottom">
                        <p>Баланс в USDT</p>
                        <p>$0.0</p>
                    </div>
                </div>

                <div className="wallet-container_header_buttons">
                    <button className="wallet-container_header_button_send">
                        <LuDownload/>
                        <p>Пополнить</p>
                    </button>
                    <button onClick={(e) => { e.preventDefault(); navigateTo("/scanner") }} className="wallet-container_header_button_qr">
                        <BsQrCodeScan />
                        <p>Оплатить по QR</p>
                    </button>
                </div>
            </div>
            
            <div className="wallet-container_history">
                <div className="wallet-container_history_title">
                    <p>Последние тразакции</p>
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
