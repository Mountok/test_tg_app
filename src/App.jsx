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


// {
//     "id": 5038590531,
//     "first_name": "Teneres",
//     "last_name": "",
//     "username": "fsociality",
//     "language_code":"ru", 
//     "is_premium": true,
//     "allows_write_to_pm": true,
//     "photo_url" : "https://t.me/i/userpic/320/ERfguPp5YC6yy9N801pk_h_sWtwxl776jEqZ3Rm-fVWFx29G4q6wOLDQ8nxM7RIr.svg"
// }

function App() {

    const [userName, SetUserName] = useState()
    const [telegramID, SetTelegramID] = useState(0)

    useEffect(() => {
        const tg = window.Telegram.WebApp;
        if (tg) {
            tg.setHeaderColor?.('#FFF001');
        }
    }, []);

    useEffect(() => {
        const tg = window.Telegram.WebApp;
        const user = tg.initDataUnsafe.user;
        if (!user) {
            alert("Telegram user not found");
            // return;
        }

        const userObj = JSON.parse(JSON.stringify(user))
        const firstname = userObj["first_name"];
        const lastname = userObj["last_name"];
        const telegramId = userObj["id"];
        const username = userObj["username"];

        SetTelegramID(telegramId)
        SetUserName(firstname + lastname)

        var isLogin = false;
        //  Проверка авторизации
        Me(telegramId).then((res) => {
            console.log(res);
            // alert("Рады вас видеть сново")
            isLogin = true

        }).catch((err) => {
            isLogin == false
            if (err.status === 401) {
                console.log("Unauthorization ", err);
            }
            // tg.showAlert("err  /me - ", JSON.stringify(err), err.status)
            console.log(err);
        })

        if (isLogin == false) {
            //  Авторизация
            Login(telegramId, username, firstname, lastname).then((res) => {
                console.log("resp  /login - ", JSON.stringify(res))
                console.log(res);
            })
        } else {
            // alert("Добро пожаловать вы зарегитрированы")
        }
    }, []);
    return (
        <Router>
            <div className="background_shadow_drop"></div>
            <div className="app-wrapper">
                <Routes>
                    <Route
                        path="/"
                        element={
                            telegramID
                                ? <WalletPage telegramID={telegramID} username={userName} />
                                : <div>Загрузка…</div>
                        }
                    />                    <Route path="/scanner" element={<QrScanner />} />
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
