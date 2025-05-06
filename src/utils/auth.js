import axios from "axios";


export const Login = async (telegramId,username,firstname,lastname) => {
    var {data} = await axios.post("http://localhost:8880/auth/login", {
        telegram_id: telegramId,
        username: username,
        first_name: firstname,
        last_name: lastname,
    }).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
    return data
}
export const Me = async (telegramId) => {
    var {data} = await axios.get(`http://localhost:8880/auth/me?telegram_id=${telegramId}`)
    return data
}