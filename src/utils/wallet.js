import axios from "axios";

var telegramId = 123456780;

export const GetBalance = async () => {
    var {data} = await axios.get("http://localhost:8880/api/wallet/balance", {
        headers: {
            "X-Telegram-ID": telegramId,
        }
    })
    return data
}

export const CreateWallet = async () => {
    var data = await axios.post("http://localhost:8880/api/wallet/create", {}, {
        headers: {
            "X-Telegram-ID": telegramId,
        }
    })
    return data
}