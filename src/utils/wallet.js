import axios from "axios";


const API_URL = "https://plataplay.duckdns.org";
// const API_URL = "http://localhost:8880";

export const CreateWallet = async (telegramId) => {
    var data = await axios.post(API_URL+"/api/wallet/create", {}, {
        headers: {
            "X-Telegram-ID": telegramId,
        }
    })
    return data
}

export const GetWallet = async (telegramId) => {
    var { data } = await axios.get(API_URL+"/api/wallet/", {
        headers: {
            "X-Telegram-ID": telegramId,
        }
    })
    return data
}


export const GetOrders = async () => {
    var { data } = await axios.get(API_URL+"/api/admin/orders")
    console.log(data)
    return data
}

export const GetOrdersByTelegramId = async (telegramId) => {
    var { data } = await axios.get(API_URL+"/api/wallet/orders/history", {
        headers: {
            "X-Telegram-ID": telegramId,
        }
    })
    return data
}

export const PayQR = async (orderId) => {
    var { data } = await axios.post(`${API_URL}/api/admin/payqr/${orderId}`)
    console.log(data)
    return data
}


export const CreateOrder = async (telegramId, summa, qr_link,crypto) => {
    alert(crypto)
    var { data } = await axios.post(API_URL+"/api/wallet/create/sbp/order", {
	    "amount":summa,
        "crypto": crypto,
	    "qr_link":qr_link
    }, {
        headers: {"X-Telegram-ID": telegramId ? telegramId : 0}
    })
    return data
}



export const GetBalanceTRX = async (telegramId,address) => {
    var {data} = await axios.post(API_URL+"/api/wallet/check-trx-balance", {
        "address": address
    },{
        headers: {
            "X-Telegram-ID": telegramId,
        }
    })
    return data
}



export const GetBalanceUSDT = async (telegramId,address) => {
    var { data } = await axios.post(API_URL+"/api/wallet/check-balance",
        {
            "address": address,
            "usdt_contract": "TTpC8a19eUj9LbQmZLrX7bZyHCyCWhrv2C"
        }, 
        {
            headers:  {"X-Telegram-ID": telegramId ? telegramId : 0}
        })
    return data
}

export const CheckOrderStatus = async (orderId) => {
    var {data} = await axios.get(`${API_URL}/api/wallet/state/order/${orderId}`,{
        headers: {
            "X-Telegram-ID": 12345678,
        }
    });
    return data
}