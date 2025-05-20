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

import { Login, Me } from './utils/auth.js';
import { HiCreditCard } from 'react-icons/hi2';
import { TbTransfer } from 'react-icons/tb';
import { LuHistory } from 'react-icons/lu';
import { TbSettings2 } from 'react-icons/tb';
import Onboarding from './Components/OnBoarding/Onboarding.jsx';

function App() {
    const [userName, setUserName] = useState();
    const [telegramID, setTelegramID] = useState(null);
    const [onboardDone, setOnboardDone] = useState(true); // fasle

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg) return;
        tg.setHeaderColor?.('#FFF001');

        const user = tg.initDataUnsafe?.user;
        if (!user) {
            alert('Telegram user not found');
            return;
        }

        const { id, first_name, last_name, username } = user;
        setTelegramID(id);
        setUserName(`${first_name} ${last_name}`);

        Me(id)
            .then(() => {
                // если /me отработал без ошибок — пропускаем онбординг
                setOnboardDone(true);
            })
            .catch(err => {
                if (err.status === 401) {
                    // новый пользователь — оставить онбординг
                    setOnboardDone(true); // false 
                    // выполнить регистрацию на бэке
                    Login(id, username, first_name, last_name).catch(console.error);
                } else {
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
                        element={<Onboarding telegramID={telegramID} onFinish={() => setOnboardDone(true)} />}
                    />
                    <Route
                        path="/"
                        element={
                            onboardDone
                                ? <WalletPage telegramID={telegramID} username={userName} />
                                : <Onboarding telegramID={telegramID} onFinish={() => setOnboardDone(true)} />
                        }
                    />
                    <Route path='/history' element={<History/>} />
                    <Route path="/scanner" element={<QrScanner />} />
                </Routes>
                {onboardDone && <BottomNav />}
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
            <Link to="/history" className={location.pathname === '/history' ? 'nav-link active' : 'nav-link'}>
                <TbTransfer size={30} />
            </Link>
            <Link to="/scanner" className={location.pathname === '/scanner' ? 'nav-link active' : 'nav-link'}>
                <LuHistory size={30} />
            </Link>
            <Link to="/settings" className={location.pathname === '/settings' ? 'nav-link active' : 'nav-link'}>
                <TbSettings2 size={30} />
            </Link>
        </nav>
    );
}

export default App;
