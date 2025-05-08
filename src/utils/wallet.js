import axios from "axios";


export const GetBalance = async () => {
    var {data} = await axios.get("http://localhost:8880/api/wallet/balance", {
        headers: {
            "X-Telegram-ID": telegramId,
        }
    })
    return data
}

export const CreateWallet = async () => {
    var data = await axios.post("https://plataplay.duckdns.org/api/wallet/create", {}, {
        headers: {
            "X-Telegram-ID": telegramId,
        }
    })
    return data
}