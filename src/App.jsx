import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import QrScanner from './Components/QrScanner/QrScanner';
import './App.css';
import WalletPage from "./Components/WalletPage/WalletPage.jsx";
import { FaWallet, FaQrcode } from 'react-icons/fa';
import { BsQrCodeScan } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";

function App() {
    return (
        <Router>
            <div className="app-wrapper">
                <Routes>
                    <Route path="/" element={<WalletPage />} />
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
                <FaWallet size={30} />
            </Link>
            <Link to="/scanner" className={location.pathname === '/scanner' ? 'nav-link active' : 'nav-link'}>
                <BsQrCodeScan size={30} />
            </Link>
            <Link to="/settings" className={location.pathname === '/scanner' ? 'nav-link active' : 'nav-link'}>
                <IoSettingsOutline size={30} />
            </Link>
        </nav>
    );
}

export default App;
