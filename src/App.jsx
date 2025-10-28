// src/App.jsx
import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
    useLocation,
    useSearchParams,
    useNavigate
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
import History from './Components/HistoryPage/History.jsx';
import Deposit from './Components/DepositPage/Deposit.jsx';
import WithdrawPage from './Components/WithdrawPage/WithdrawPage.jsx';
import Setting from './Components/Settings/Setting.jsx';
import UserAgreement from './Components/Settings/UserAgreement/UserAgreement.jsx';
import Exchange from './Components/Exchange/Exchange.jsx';
import ReferralPage from './Components/ReferralPage/ReferralPage.jsx';
import ReferralListPage from './Components/ReferralPage/ReferralListPage.jsx';
// import ReferralHandler from './Components/ReferralPage/ReferralHandler.jsx'; // ОТКЛЮЧЕН: дублирует логику
import Toast from './Components/UI/Toast.jsx';
import { PinProvider, usePin } from './pin/PinProvider.jsx';
import { registerByReferralCode } from './utils/referral';
import UnderConstruction from './Components/UnderConstruction';

function App() {
    const [userName, setUserName] = useState();
    const [telegramID, setTelegramID] = useState(null);
    const [onboardDone, setOnboardDone] = useState(null);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [isBlockedEnv, setIsBlockedEnv] = useState(false);

    // Функция для обработки реферального кода
    const handleReferralCode = async (telegramId) => {
        try {
            // Проверяем наличие отложенного реферального кода
            const pendingRefCode = localStorage.getItem('pending_referral_code');
            console.log('[handleReferralCode] Проверяем pending код:', pendingRefCode);
            console.log('[handleReferralCode] telegramId:', telegramId);
            
            if (pendingRefCode && telegramId) {
                console.log('[handleReferralCode] Отправляем запрос на регистрацию...');
                
                // Регистрируем пользователя по реферальному коду через общий API-слой
                await registerByReferralCode(pendingRefCode);
                
                // Убираем код из localStorage
                localStorage.removeItem('pending_referral_code');
                console.log('[handleReferralCode] Пользователь успешно зарегистрирован по реферальному коду:', pendingRefCode);
                
                // Показываем алерт об успехе С ЛОГАМИ
                // const successMessage = `✅ Реферальный код применен!\nКод: ${pendingRefCode}\nTelegram ID: ${telegramId}\nВремя: ${new Date().toLocaleTimeString()}`;
                // if (window.Telegram?.WebApp?.showAlert) {
                //     window.Telegram.WebApp.showAlert(successMessage);
                // } else {
                //     alert(successMessage);
                // }
            } else {
                // const debugMessage = `❌ Не удалось применить код\nPending код: ${pendingRefCode || 'НЕТ'}\nTelegram ID: ${telegramId || 'НЕТ'}\nВремя: ${new Date().toLocaleTimeString()}`;
                console.log('[handleReferralCode] Нет pending кода или telegramId');
                
                // Показываем debug алерт
                // if (window.Telegram?.WebApp?.showAlert) {
                //     window.Telegram.WebApp.showAlert(debugMessage);
                // } else {
                //     alert(debugMessage);
                // }
            }
        } catch (error) {
            console.error('[handleReferralCode] Ошибка при обработке реферального кода:', error);
            
            // Показываем алерт об ошибке С ЛОГАМИ
            // const errorMessage = `❌ Ошибка регистрации!\nОшибка: ${error.message}\nTelegram ID: ${telegramId || 'НЕТ'}\nВремя: ${new Date().toLocaleTimeString()}`;
            // if (window.Telegram?.WebApp?.showAlert) {
            //     window.Telegram.WebApp.showAlert(errorMessage);
            // } else {
            //     alert(errorMessage);
            // }
        }
    };

    // Функция завершения онбординга с обработкой реферального кода
    const handleOnboardingFinish = () => {
        console.log('[handleOnboardingFinish] Завершение онбординга');
        console.log('[handleOnboardingFinish] telegramID:', telegramID);
        console.log('[handleOnboardingFinish] pending код:', localStorage.getItem('pending_referral_code'));
        
        setOnboardDone(true);
        
        // Проверяем, остался ли необработанный реферальный код
        const pendingRefCode = localStorage.getItem('pending_referral_code');
        if (pendingRefCode && telegramID) {
            console.log('[handleOnboardingFinish] Найден необработанный реферальный код, обрабатываем...');
            handleReferralCode(telegramID);
        } else if (!pendingRefCode) {
            console.log('[handleOnboardingFinish] Реферальный код уже обработан в онбординге');
        } else {
            // Если telegramID еще не установлен, показываем debug
            // const debugMessage = `⚠️ Онбординг завершен, но telegramID не найден\nTelegram ID: ${telegramID || 'НЕТ'}\nPending код: ${localStorage.getItem('pending_referral_code') || 'НЕТ'}\nВремя: ${new Date().toLocaleTimeString()}`;
            console.log('[handleOnboardingFinish] Нет telegramID');
            
            // if (window.Telegram?.WebApp?.showAlert) {
            //     window.Telegram.WebApp.showAlert(debugMessage);
            // } else {
            //     alert(debugMessage);
            // }
        }
    };

    useEffect(() => {
        // Проверка на запуск только внутри мобильного Telegram Mini App по платформе
        const tg = window?.Telegram?.WebApp;
        const platform = tg?.platform;
        if (!platform || (!["ios", "android"].includes(platform))) {
            setIsBlockedEnv(true);
            return;
        }
        // Временно: убираем блокировку для диагностики Telegram WebView
        const startApp = tg?.initDataUnsafe?.start_param;
        console.log('[App] startApp параметр:', startApp);
        console.log('[App] Полные initDataUnsafe:', tg?.initDataUnsafe);
        console.log(tg)
        
        if (startApp && startApp.startsWith('ref-')) {
            const referralCode = startApp.replace('ref-', '');
            console.log('[App] Найден реферальный код:', referralCode);
            localStorage.setItem('pending_referral_code', referralCode);
            console.log('[App] Реферальный код сохранен в localStorage');
            
            // Показываем алерт что код получен
            // const codeReceivedMessage = `📥 Реферальный код получен!\nКод: ${referralCode}\nБудет применен после завершения регистрации\nВремя: ${new Date().toLocaleTimeString()}`;
            // if (window.Telegram?.WebApp?.showAlert) {
            //     window.Telegram.WebApp.showAlert(codeReceivedMessage);
            // } else {
            //     alert(codeReceivedMessage);
            // }
        } else {
            console.log('[App] Реферальный код не найден в startApp');
        }
        
        // Даём время на инициализацию Telegram WebApp
        setTimeout(() => {
            const user = tg?.initDataUnsafe?.user;
            const InitDataTest = tg.initDataUnsafe;
            console.log("################")
            console.log(tg.initDataRaw)
            console.log("################")
            console.log(tg.initDataUnsafe)
            
            if (user) {
                const { id, first_name, last_name, username } = user;
                window?.Telegram?.WebApp?.setHeaderColor?.('#FFF001');
                window?.Telegram?.WebApp?.ready?.();
                setTelegramID(id);
                setUserName(`${first_name} ${last_name}`);
                
                // Выполняем авторизацию только если есть user
                proceedWithAuth(id, username, first_name, last_name);
            } else {
                // Fallback: работаем без Telegram данных
                setIsAuthChecking(false);
                setOnboardDone(true);
            }
        }, 100);
    }, []);

    const proceedWithAuth = (id, username, first_name, last_name) => {

        Me(id)
            .then(() => {
                // If Me() executes successfully, skip onboarding
                setOnboardDone(true);
                // Обрабатываем реферальный код для существующего пользователя
                handleReferralCode(id);
                setIsAuthChecking(false);
            })
            .catch(err => {
                if (err?.status === 401 || err?.response?.status === 401) {
                    // New user - show onboarding (НЕ создаем пользователя сразу!)
                    console.log('[App] Новый пользователь, показываем онбординг без создания аккаунта');
                    setOnboardDone(false);
                    setIsAuthChecking(false);
                } else {
                    // Any other error - show onboarding anyway
                    setOnboardDone(false);
                    console.error(err);
                    setIsAuthChecking(false);
                }
            });
    };


    // Блокирующий экран для случаев, когда приложение открыто не в Telegram Mini App
    if (isBlockedEnv) {
        return (
            <div className="blocked-container">
                <div className="blocked-card">
                    <img src="/images/logo.png" alt="PlataPay" className="blocked-logo" />
                    <h1 className="blocked-title">Откройте приложение в мобильном Telegram</h1>
                    <p className="blocked-text">
                        Это приложение доступно только внутри мобильного приложения Telegram на iOS или Android.
                    </p>
                    <a
                        className="btn-telegram"
                        href="https://t.me/PlataPay_bot"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Открыть бота @PlataPay_bot
                    </a>
                </div>
            </div>
        );
    }

    // Пока идёт первичная проверка авторизации, ничего не рендерим
    if (isAuthChecking) {
        return null;
    }

    

    return (
        <PinProvider>
        <Router>
            <div className="background_shadow_drop" />
            <div className="app-wrapper">
                {/* <ReferralHandler /> - ОТКЛЮЧЕН: дублирует логику парсинга реферального кода */}
                <Routes>
                    <Route
                        path="/onboarding"
                        element={<Onboarding  onFinish={handleOnboardingFinish} />}
                    />
                    <Route
                        path="/"
                        element={
                            onboardDone
                                ? <WalletPage  username={userName} />
                                : <Onboarding onFinish={handleOnboardingFinish} />
                        }
                    />
                    <Route path='/history' element={<History telegramID={telegramID}/>} />
                    <Route path="/scanner" element={<QrScanner telegramID={telegramID} />} />
                    <Route path='/deposit' element={<Deposit telegramID={telegramID}/>} />
                    <Route path='/withdraw' element={<UnderConstruction />} />
                    {/* <Route path='/withdraw' element={<WithdrawPage telegramID={telegramID}/>} /> */}

                    <Route path='/settings' element={<Setting/>} />
                    <Route path='/settings/user-agreement' element={<UserAgreement/>} />
                    <Route path='/exchange' element={<Exchange/>} />
                    <Route path='/referral' element={<ReferralPage />} />
                    <Route path='/referral/list' element={<ReferralListPage />} />

                </Routes>
                {onboardDone && <BottomNav />}
                <Toast />
            </div>
        </Router>
        </PinProvider>
    );
}

function BottomNav() {
    const location = useLocation();
    return (
        <>
        {location.pathname === '/scanner' || location.pathname === '/deposit' || location.pathname == "/x7k9m2p8/manual-pay" ? 
        (null)
        : (
        <nav className="bottom-nav">
            <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
                <HiCreditCard size={30} />
            </Link>
            <Link to="/exchange" className={location.pathname === '/exchange' ? 'nav-link active' : 'nav-link'}>
                <TbTransfer size={30} />
            </Link>
            <Link to="/history" className={location.pathname === '/history' ? 'nav-link active' : 'nav-link'}>
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

function AdminGuard({ children }) {
    const navigate = useNavigate();
    const [isAllowed, setIsAllowed] = React.useState(false);

    React.useEffect(() => {
        // Уже авторизован в этой сессии
        if (sessionStorage.getItem('admin_access_granted') === 'true') {
            setIsAllowed(true);
            return;
        }

        const secretFromEnv = import.meta.env.VITE_ADMIN_KEY;
        const entered = window.prompt('Введите секретный ключ для доступа к админке');

        if (!entered) {
            alert('Доступ в админку отменен');
            navigate('/');
            return;
        }

        if (entered === secretFromEnv) {
            sessionStorage.setItem('admin_access_granted', 'true');
            setIsAllowed(true);
        } else {
            alert('Неверный секретный ключ');
            navigate('/');
        }
    }, [navigate]);

    if (!isAllowed) return null;
    return children;
}
