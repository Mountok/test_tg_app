import axios from "axios";


export const GetBalance = async (telegramId) => {
    var {data} = await axios.get("https://plataplay.duckdns.org/api/wallet/balance", {
        headers: {
            "X-Telegram-ID": telegramId,
        }
    })
    return data
}

export const CreateWallet = async (telegramId) => {
    var data = await axios.post("https://plataplay.duckdns.org/api/wallet/create", {}, {
        headers: {
            "X-Telegram-ID": telegramId,
        }
    }) 
    return data
}

export const GetWallet = async (telegramId) => {
    var {data} = await axios.get("https://plataplay.duckdns.org/api/wallet/get", {
        headers: {
            "X-Telegram-ID": telegramId,
        }
    })
    return data
}