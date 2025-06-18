// src/App.jsx
import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
    useLocation
} from 'react-router-dom';

import QrScanner from './Components/QrScanner/QrScanner';
import WalletPage from './Components/WalletPage/WalletPage';
import './App.css';

import { Login, Me, TelegramInfo } from './utils/auth.js';
import { HiCreditCard } from 'react-icons/hi2';
import { TbTransfer } from 'react-icons/tb';
import { LuHistory } from 'react-icons/lu';
import { TbSettings2 } from 'react-icons/tb';
import Onboarding from './Components/OnBoarding/Onboarding.jsx';
import ManualPayQR from './admin/ManualPayQR/ManualPayQR.jsx';
import History from './Components/HistoryPage/History.jsx';
import Deposit from './Components/DepositPage/Deposit.jsx';
import Setting from './Components/Settings/Setting.jsx';

function App() {
    const [userName, setUserName] = useState();
    const [telegramID, setTelegramID] = useState(null);
    const [onboardDone, setOnboardDone] = useState(true); // Default to false until Me() succeeds



    useEffect(() => {
        // const tg = window.Telegram?.WebApp;
        // if (!tg) return;
        // tg.setHeaderColor?.('#FFF001');

        // const user = tg.initDataUnsafe?.user;
        // if (!user) {
        //     alert('Telegram user not found');
        //     return;
        // }

        const { id, first_name, last_name, username } = TelegramInfo() || {};
        // alert(`Telegram user: ${first_name} ${last_name} (${id})`);
        if (!id || !first_name) {
            alert('Telegram user ID or first name is missing');
            return;
        }
        setTelegramID(id);
        setUserName(`${first_name} ${last_name}`);

        Me(id)
            .then(() => {
                // If Me() executes successfully, skip onboarding
                setOnboardDone(true);
            })
            .catch(err => {
                if (err.status === 401) {
                    // New user - show onboarding
                    setOnboardDone(false);
                    // Register on backend
                    Login(id, username, first_name, last_name).catch(console.error);
                } else {
                    // Any other error - show onboarding anyway
                    setOnboardDone(false);
                    console.error(err);
                }
            });
    }, []);

    return (
        <Router>
            <div className="background_shadow_drop" />
            <div className="app-wrapper">
                <Routes>
                    <Route
                        path="/onboarding"
                        element={<Onboarding  onFinish={() => setOnboardDone(true)} />}
                    />
                    <Route
                        path="/"
                        element={
                            onboardDone
                                ? <WalletPage  username={userName} />
                                : <Onboarding onFinish={() => setOnboardDone(true)} />
                        }
                    />
                    <Route path='/history' element={<History/>} />
                    <Route path="/scanner" element={<QrScanner telegramID={telegramID} />} />
                    <Route path='/admin/manual-pay' element={<ManualPayQR telegramID={telegramID}/>} />
                    <Route path='/deposit' element={<Deposit telegramID={telegramID}/>} />
                    <Route path='/settings' element={<Setting/>} />

                </Routes>
                {onboardDone && <BottomNav />}
            </div>
        </Router>
    );
}

function BottomNav() {
    const location = useLocation();
    return (
        <>
        {location.pathname === '/scanner' || location.pathname === '/deposit' || location.pathname == "/admin/manual-pay" ? 
        (null)
        : (
        <nav className="bottom-nav">
            <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
                <HiCreditCard size={30} />
            </Link>
            <Link to="/" className={location.pathname === '/history' ? 'nav-link active' : 'nav-link'}>
                <TbTransfer size={30} />
            </Link>
            <Link to="/history" className={location.pathname === '/scanner' ? 'nav-link active' : 'nav-link'}>
                <LuHistory size={30} />
            </Link>
            <Link to="/settings" className={location.pathname === '/settings' ? 'nav-link active' : 'nav-link'}>
                <TbSettings2 size={30} />
            </Link>
        </nav>
        )}
        </>


    );
}

export default App;
