import { useState } from "react";
import { ethers } from "ethers";
import "./WalletPage.css";
import { IoSettingsOutline } from "react-icons/io5";

import { BsQrCodeScan } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function WalletPage() {
    const [username, setUsername] = useState("Islam")
    const navigateTo = useNavigate()
    

    return (
        <div className="wallet-container">
            <div className="wallet-container_header">
                <div className="wallet-container_header_top">
                    <div className="wallet-container_header_top_user">
                        <div className="wallet-container_header_top_user_avatar">
                            {/* здесть надо аватарку отобразить */}
                        </div>
                        <div className="wallet-container_header_top_user_name">
                            <p>Hey, {username}</p>
                            <p>Welcome back</p>
                        </div>
                    </div>
                    <div className="wallet-container_header_top_settings">
                        <IoSettingsOutline/>
                    </div>
                </div>
                <div className="wallet-container_header_balance">
                    <div className="wallet-container_header_balance_top">
                        <p><span>Wallet: </span> Tx30drl4d..</p>
                    </div>
                    <div className="wallet-container_header_balance_bottom">
                        <p>$17,200</p>
                    </div>
                </div>

                <div className="wallet-container_header_buttons">
                    <button className="wallet-container_header_button_send">Send</button>
                    <button className="wallet-container_header_button_receive">Receive</button>
                    <button onClick={(e)=>{e.preventDefault();navigateTo("/scanner")}} className="wallet-container_header_button_qr">
                        <BsQrCodeScan/>
                    </button>
                </div>
            </div>

        </div>
    );
}
