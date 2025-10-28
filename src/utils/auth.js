import axios from "axios";

const API_URL = "https://plataplay.duckdns.org";
// const API_URL = "http://localhost:8880";

export const Login = async (telegramId, username, firstname, lastname) => {
    const jsonBody = {
        telegram_id: telegramId,
        username: username,
        first_name: firstname == "" ? " " : firstname,
        last_name: lastname == "" ? " " : lastname,
    }
    // alert(JSON.stringify(jsonBody))
    var { data } = await axios.post(API_URL+"/auth/login", jsonBody)
    return data
}
export const Me = async (telegramId) => {
    var { data } = await axios.post(`${API_URL}/auth/me`, { telegram_id: telegramId })
    // Сохраняем токен в localStorage (если есть)
    if(data.token) localStorage.setItem('jwt_token', data.token)
    return data
}


export const TelegramInfo = () => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    tg.setHeaderColor?.('#FFF001');

    const user = tg.initDataUnsafe?.user;
    if (!user) {
        alert('Telegram user not found');
        return;
    }
    return user;
}