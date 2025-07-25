import React, { useEffect, useState } from 'react'
import './Setting.css'
import { BiSolidLock } from "react-icons/bi";
import { RiTelegram2Fill } from "react-icons/ri";
import { TelegramInfo } from '../../utils/auth';
import Design from './Design/Design';
import Privacy from './Privacy/Privacy';

const Setting = () => {
    const [userInfo, setUserinfo] = useState("username")
    const [photo_url, setPhoto_url] = useState("")
    const [showDesign, setShowDesign] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    useEffect(() => {
        var { username, photo_url } = TelegramInfo() || {}
        setUserinfo(username)
        setPhoto_url(photo_url)
    }, [])

    return (
        <div className="settings-container">
            <div className="settings-header">
                <button className="settings-back-btn">&#8592;</button>
                <span className="settings-title">Настройки</span>
            </div>
            <div className="settings-profile">
                <div className="settings-avatar">
                    {photo_url ? (
                        <img src={photo_url} alt="avatar" className="settings-avatar-img" />
                    ) : null}
                </div>
                <span className="settings-username">@{userInfo}</span>
            </div>
            <div className="settings-section-label">Параметры</div>
            <div className="settings-section">
                <div className="settings-item" onClick={() => setShowPrivacy(true)}>
                    <span className="settings-icon yellow">
                        <BiSolidLock />
                    </span>
                    <span>Приватность</span>
                    <span className="settings-arrow">&gt;</span>
                </div>
                <div className="settings-item" onClick={() => setShowDesign(true)}>
                    <span className="settings-icon yellow">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_288_5591)">
                                <path d="M8.02847 0.423006C8.55333 -0.141002 9.44698 -0.141002 9.97183 0.423006L11.3449 1.89859C11.6072 2.1804 11.9787 2.33419 12.3634 2.32047L14.3781 2.2482C15.148 2.22052 15.7798 2.8523 15.7521 3.62222L15.6798 5.63687C15.6661 6.02159 15.8199 6.39315 16.1017 6.65543L17.5773 8.02847C18.1413 8.55333 18.1413 9.44698 17.5773 9.97183L16.1017 11.3449C15.8199 11.6072 15.6661 11.9787 15.6798 12.3634L15.7521 14.3781C15.7798 15.148 15.148 15.7798 14.3781 15.7521L12.3634 15.6798C11.9787 15.6661 11.6072 15.8199 11.3449 16.1017L9.97183 17.5773C9.44698 18.1413 8.55333 18.1413 8.02847 17.5773L6.65543 16.1017C6.39315 15.8199 6.02159 15.6661 5.63687 15.6798L3.62222 15.7521C2.8523 15.7798 2.22052 15.148 2.2482 14.3781L2.32047 12.3634C2.33419 11.9787 2.1804 11.6072 1.89859 11.3449L0.423006 9.97183C-0.141002 9.44698 -0.141002 8.55333 0.423006 8.02847L1.89859 6.65543C2.1804 6.39315 2.33419 6.02159 2.32047 5.63687L2.2482 3.62222C2.22052 2.8523 2.8523 2.22052 3.62222 2.2482L5.63687 2.32047C6.02159 2.33419 6.39315 2.1804 6.65543 1.89859L8.02847 0.423006ZM8.99527 3.59976C8.33324 3.59901 7.67536 3.70384 7.04605 3.90933C6.85671 3.97717 6.68832 4.09458 6.55972 4.24918C6.43128 4.40371 6.34676 4.58991 6.31461 4.78824C6.28245 4.9866 6.30403 5.18992 6.37711 5.37711C6.45025 5.5643 6.5725 5.72858 6.73062 5.85269C8.96834 7.54728 9.14652 10.4624 7.0939 12.3371C6.94914 12.4758 6.84368 12.651 6.78922 12.8439C6.73479 13.0368 6.73349 13.2409 6.78433 13.4347C6.8352 13.6286 6.93712 13.8051 7.07926 13.9464C7.22141 14.0878 7.39869 14.1895 7.59293 14.2394C8.33462 14.4166 9.10393 14.4476 9.85758 14.3312C11.0235 14.1338 12.094 13.5633 12.9074 12.7052C13.7208 11.8472 14.2328 10.7478 14.3673 9.5734C14.4507 8.81887 14.3731 8.05524 14.1388 7.33316C13.9044 6.61099 13.5187 5.94688 13.008 5.38492C12.5011 4.82361 11.8818 4.37493 11.1906 4.06754C10.4995 3.76021 9.75168 3.60034 8.99527 3.59976Z" fill="#FFF001" />
                            </g>
                            <defs>
                                <clipPath id="clip0_288_5591">
                                    <rect width="18" height="18" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </span>
                    <span>Оформление</span>
                    <span className="settings-arrow">&gt;</span>
                </div>
            </div>
            <div className="settings-section-label">О нас</div>
            <div className="settings-section">
                <div className="settings-item">
                    <span className="settings-icon yellow">
                        <RiTelegram2Fill />
                    </span>
                    <span>Официальные аккаунты</span>
                    <span className="settings-arrow">&gt;</span>
                </div>
                <div className="settings-item">
                    <span className="settings-icon yellow">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18C7.87827 18 5.84344 17.1571 4.34315 15.6569C2.84285 14.1566 2 12.1217 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2ZM10.424 5.41943C9.49372 5.41943 8.76457 5.68343 8.224 6.21143C7.67086 6.73943 7.40686 7.46857 7.40686 8.39886H8.84C8.84 7.87086 8.94057 7.456 9.15429 7.16686C9.39314 6.81486 9.78286 6.65143 10.336 6.65143C10.7634 6.65143 11.1029 6.76457 11.3417 7.00343C11.568 7.24229 11.6937 7.56914 11.6937 7.984C11.6937 8.29829 11.5806 8.6 11.3543 8.87657L11.2034 9.05257C10.3863 9.78171 9.896 10.3097 9.73257 10.6491C9.55657 10.9886 9.48114 11.4034 9.48114 11.8811V12.0571H10.9269V11.8811C10.9269 11.5794 10.9897 11.3154 11.1154 11.064C11.2286 10.8377 11.392 10.624 11.6183 10.4354C12.2217 9.90743 12.5863 9.568 12.6994 9.44229C13.0011 9.04 13.1646 8.52457 13.1646 7.896C13.1646 7.12914 12.9131 6.52571 12.4103 6.08571C11.9074 5.63314 11.2411 5.41943 10.424 5.41943ZM10.1977 12.6731C9.94139 12.6662 9.69276 12.7611 9.50629 12.9371C9.41422 13.0239 9.34188 13.1294 9.29416 13.2465C9.24644 13.3636 9.22446 13.4896 9.22971 13.616C9.22971 13.8926 9.31771 14.1189 9.50629 14.2949C9.69136 14.4745 9.93981 14.5739 10.1977 14.5714C10.4743 14.5714 10.7006 14.4834 10.8891 14.3074C10.9832 14.2189 11.0575 14.1116 11.1073 13.9925C11.1571 13.8734 11.1813 13.7451 11.1783 13.616C11.1807 13.49 11.1574 13.3648 11.1099 13.2481C11.0623 13.1314 10.9915 13.0256 10.9017 12.9371C10.7104 12.7608 10.4578 12.6661 10.1977 12.6731Z" fill="#FFF001" />
                        </svg>
                    </span>
                    <span>F.A.Q.</span>
                    <span className="settings-arrow">&gt;</span>
                </div>
                <div className="settings-item">
                    <span className="settings-icon yellow">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58174 0 0 3.58169 0 8C0 12.4183 3.58174 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58169 12.4183 0 8 0ZM9.00175 4.8C9.00175 5.38003 8.57944 5.8 8.00813 5.8C7.4137 5.8 7.00175 5.38003 7.00175 4.7889C7.00175 4.22076 7.42486 3.8 8.00813 3.8C8.57944 3.8 9.00175 4.22076 9.00175 4.8ZM7.20175 7.2H8.80175V12H7.20175V7.2Z" fill="#FFF001" />
                        </svg>
                    </span>
                    <span>О проекте</span>
                    <span className="settings-arrow">&gt;</span>
                </div>
            </div>
            <div className="settings-section">
                <div className="settings-item">
                    <span className="settings-icon yellow">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.32752 15C3.68158 15 4.02114 14.8525 4.2715 14.5899C4.52186 14.3274 4.66251 13.9713 4.66251 13.6V9.4C4.66251 9.0287 4.52186 8.6726 4.2715 8.41005C4.02114 8.1475 3.68158 8 3.32752 8V7.3C3.32752 6.00044 3.81979 4.7541 4.69605 3.83518C5.57232 2.91625 6.76078 2.4 8 2.4C9.23922 2.4 10.4277 2.91625 11.3039 3.83518C12.1802 4.7541 12.6725 6.00044 12.6725 7.3V8C12.3184 8 11.9789 8.1475 11.7285 8.41005C11.4781 8.6726 11.3375 9.0287 11.3375 9.4V13.6H9.335C9.15796 13.6 8.98818 13.6737 8.863 13.805C8.73782 13.9363 8.6675 14.1143 8.6675 14.3C8.6675 14.4857 8.73782 14.6637 8.863 14.795C8.98818 14.9263 9.15796 15 9.335 15H12.6725C13.4374 14.9976 14.1784 14.7197 14.7713 14.2128C15.3642 13.7059 15.7731 13.0008 15.9295 12.2156C16.0859 11.4303 15.9803 10.6125 15.6304 9.89915C15.2805 9.18577 14.7076 8.62008 14.0075 8.2968V7.3C14.0075 5.62914 13.3746 4.02671 12.2479 2.84523C11.1213 1.66375 9.59328 1 8 1C6.40672 1 4.87869 1.66375 3.75207 2.84523C2.62545 4.02671 1.99252 5.62914 1.99252 7.3V8.2968C1.29242 8.62008 0.719468 9.18577 0.36958 9.89915C0.0196916 10.6125 -0.0858943 11.4303 0.0704982 12.2156C0.226891 13.0008 0.635769 13.7059 1.22868 14.2128C1.8216 14.7197 2.56255 14.9976 3.32752 15Z" fill="#FFF001" />
                        </svg>
                    </span>
                    <span>Написать в поддержку</span>
                    <span className="settings-arrow">&gt;</span>
                </div>
            </div>
            <div className="settings-section">
                <div className="settings-item logout">
                    <span className="settings-icon red">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.8086 10.1424L16.2726 7.60026C16.0179 7.3457 15.6074 7.3457 15.3545 7.602C15.1016 7.85831 15.1024 8.27154 15.3562 8.52611L16.7767 9.95062H14.2346C14.2433 10.3865 14.2433 10.8224 14.2346 11.2583H16.7784L15.3562 12.6846C15.1024 12.9391 15.1016 13.3532 15.3545 13.6095C15.4809 13.7377 15.6481 13.8013 15.8144 13.8013C15.9798 13.8013 16.1461 13.7377 16.2726 13.6113L18.8086 11.0683C18.9316 10.9462 19 10.7788 19 10.6053C19 10.4319 18.9316 10.2653 18.8086 10.1424Z" fill="#FF6B6B" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.08884 10.6046C7.08884 10.2472 7.37466 9.95077 7.73844 9.95077L14.2346 9.95062C14.2259 8.85216 14.1651 7.75385 14.0785 6.65539V6.64667C13.758 3.13333 12.173 2 7.58253 2C1 2 1 4.48462 1 10.5C1 16.5154 1 19 7.58253 19C12.173 19 13.758 17.8667 14.0785 14.3446C14.1651 13.3246 14.2173 12.2957 14.2346 11.2583L7.73844 11.2585C7.37466 11.2585 7.08884 10.9708 7.08884 10.6046Z" fill="#FF6B6B" />
                        </svg>
                    </span>
                    <span>Выйти из аккаунта</span>
                </div>
            </div>
            <div className="settings-section">
                <div className="settings-item agreement">
                    <span className="settings-agreement-text">Пользовательское соглашение</span>
                </div>
            </div>
            <div className={`design-modal${showDesign ? ' open' : ''}`}>
                <Design onBack={() => setShowDesign(false)} />
            </div>
            <div className={`privacy-modal${showPrivacy ? ' open' : ''}`}>
                <Privacy onBack={() => setShowPrivacy(false)} />
            </div>
        </div>
    )
}

export default Setting