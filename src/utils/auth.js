import axios from "axios";

var telegramId = 123456780;

export const Login = async (username,firstname,lastname) => {
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
export const Me = async () => {
    var {data} = await axios.get(`http://localhost:8880/auth/me?telegram_id=${telegramId}`)
    return data
}