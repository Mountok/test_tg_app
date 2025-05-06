import React, { use, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import QrScanner from './Components/QrScanner/QrScanner';
import './App.css';
import WalletPage from "./Components/WalletPage/WalletPage.jsx";
import { Login, Me } from "./utils/auth.js";
import { HiCreditCard } from "react-icons/hi2";
import { TbTransfer } from "react-icons/tb";
import { LuHistory } from "react-icons/lu";
import { TbSettings2 } from "react-icons/tb";

function App() {

    const [userName, SetUserName] = useState()

    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        if (tg) {
            tg.setHeaderColor?.('#FFF001');
        }
    }, []);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        // alert("initData: " + tg?.initData);
        // alert("initDataUnsafe: " + JSON.stringify(tg?.initDataUnsafe, null, 2));

        const user = tg?.initDataUnsafe?.user;

        if (!user) {
            alert("Telegram user not found");
            return;
        }

        const telegramId = user.id;
        const firstname = user.first_name;
        const lastname = user.last_name;
        const username = user.username;

        SetUserName(firstname + lastname)

        alert("telegramId - ", telegramId)
        alert("firstname - ", firstname)
        alert("lastname - ", lastname)
        alert("username - ", username)

        Me(telegramId).then((res) => {
            console.log(res);
        }).catch((err) => {
            if (err.status === 401) {
                console.log("Unauthorization ", err);
                Login(telegramId, username, firstname, lastname).then((res) => {
                    console.log(res);
                })
            }
            console.log(err);
        })
    }, []);
    return (
        <Router>
            <div className="background_shadow_drop"></div>
            <div className="app-wrapper">
                <Routes>
                    <Route path="/" element={<WalletPage username={userName} />} />
                    <Route path="/scanner" element={<QrScanner />} />
                </Routes>
                <BottomNav />
            </div>
        </Router>
    );
}
function BottomNav() {
    const location = useLocation();

    return (
        <nav className="bottom-nav">
            <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
                <HiCreditCard size={30} />
            </Link>
            <Link to="/scanner" className={location.pathname === '/scanner' ? 'nav-link active' : 'nav-link'}>
                <TbTransfer size={30} />
            </Link>
            <Link to="/scanner" className={location.pathname === '/scanner' ? 'nav-link active' : 'nav-link'}>
                <LuHistory size={30} />
            </Link>
            <Link to="/settings" className={location.pathname === '/scanner' ? 'nav-link active' : 'nav-link'}>
                <TbSettings2 size={30} />
            </Link>
        </nav>
    );
}

export default App;
