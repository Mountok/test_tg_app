import axios from "axios";


export const Login = async (telegramId,username,firstname,lastname) => {
    const jsonBody = {
        telegram_id: telegramId,
        username: username,
        first_name: firstname == "" ? " " : firstname,
        last_name: lastname == "" ? " " : lastname,
    }
    // alert(JSON.stringify(jsonBody))
    var {data} = await axios.post("https://plataplay.duckdns.org/auth/login",jsonBody)
    return data
}
export const Me = async (telegramId) => {
    var {data} = await axios.get(`https://plataplay.duckdns.org/auth/me?telegram_id=${telegramId}`)
    return data
}