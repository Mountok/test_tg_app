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
            "usdt_contract": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
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


export const GetPrivatKey = async (telegramId) => {
    var {data} = await axios.get(`${API_URL}/api/admin/privat-key`,{
        headers: {
            "X-Telegram-ID": telegramId
        }
    })
    return data
}

export const TransactionTestnet = async (key,amount) => {
    var {data} = await axios.post(`${API_URL}/api/wallet/withdraw/test`,{
        "priv_key": key,
        "to_address": "TG2FN9BxfTjX41tAyTeRTnqqrDKtpjyfEn",
        "amount": amount,
        "usdt_contract": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
    },{
        headers: {
            "X-Telegram-ID": 1
        }
    })
    return data
}
export const TransactionVirtual = async (amount,addr) => {
    var {data} = await axios.post(`${API_URL}/api/wallet/virtual-withdraw`,{
        "address": addr,
        "amount": amount
    },{
        headers: {
            "X-Telegram-ID": 1
        }
    })
    return data
}

export const GetAdminWalletsWithHistory = async (adminSecret) => {
    const { data } = await axios.get(API_URL + "/api/admin/wallets-with-history", {
        headers: { 'X-Admin-Secret': adminSecret }
    });
    return data;
}  


export const GetEstimateTRX = async (address,amount) => {
    const {data} = await axios.post(API_URL + "/api/wallet/estimate-trx", {
        "from_address": address,
        "to_address": "TG2FN9BxfTjX41tAyTeRTnqqrDKtpjyfEn",
        "amount": amount,
        "usdt_contract": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
        
    }, {
        headers: {
            "X-Telegram-ID": 1
        }
    })
    return data
}