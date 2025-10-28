import axios from "axios";


const API_URL = "https://plataplay.duckdns.org";
// const API_URL = "http://localhost:8880";

var api_seckert_key = import.meta.env.VITE_ADMIN_KEY;

// Axios interceptor for JWT Authorization
axios.interceptors.request.use((config) => {
    // Only attach if request URL contains /api
    if (config.url && config.url.includes('/api')) {
        const jwt = localStorage.getItem('jwt_token');
        if (jwt) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${jwt}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));

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
    // alert(crypto)
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
    var {data} = await axios.get(`${API_URL}/api/admin/private-key`,{
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
    // Encode admin secret to base64 to handle non-ASCII characters in HTTP headers
    const encodedSecret = btoa(unescape(encodeURIComponent(adminSecret)));
    const { data } = await axios.get(API_URL + "/api/admin/wallets-with-history", {
        headers: { 'X-Admin-Secret': encodedSecret }
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

// Получение списка заказов на вывод для админ панели
export const GetWithdrawWaitingList = async () => {
    try {
        // Encode admin secret to base64 to handle non-ASCII characters in HTTP headers
        var api_seckert_key = import.meta.env.VITE_ADMIN_KEY;
        const { data } = await axios.get(API_URL + "/api/admin/withdraw/waiting", {
            headers: {
                "X-Admin-Secret": api_seckert_key,
                "X-Telegram-ID": "1"
            }
        });
        return data;
    } catch (error) {
        console.error('[GetWithdrawWaitingList] Ошибка получения списка заказов на вывод:', error);
        throw error;
    }
};

// Обработка заказа на вывод средств
export const ProcessWithdrawOrder = async (orderId) => {
    try {
        // Encode admin secret to base64 to handle non-ASCII characters in HTTP headers
        const encodedSecret = btoa(unescape(encodeURIComponent(api_seckert_key)));
        const { data } = await axios.put(`${API_URL}/api/admin/withdraw/${orderId}`, {}, {
            headers: {
                "X-Admin-Secret": encodedSecret,
                "X-Telegram-ID": "1"
            }
        });
        console.log('[ProcessWithdrawOrder] Заказ обработан:', data);
        return data;
    } catch (error) {
        console.error('[ProcessWithdrawOrder] Ошибка обработки заказа на вывод:', error);
        throw error;
    }
};

// Получение истории заказов на вывод для админ панели
export const GetWithdrawHistory = async () => {
    try {
        // Encode admin secret to base64 to handle non-ASCII characters in HTTP headers
        const encodedSecret = btoa(unescape(encodeURIComponent(api_seckert_key)));
        const { data } = await axios.get(API_URL + "/api/admin/withdraw/history", {
            headers: {
                "X-Admin-Secret": encodedSecret,
                "X-Telegram-ID": "1"
            }
        });
        return data;
    } catch (error) {
        console.error('[GetWithdrawHistory] Ошибка получения истории заказов на вывод:', error);
        throw error;
    }
};

// Функция для отправки запроса на вывод средств через новый API
export const SendWithdrawRequest = async (telegramId, fromAddress, toAddress, amount) => {
    console.log('[SendWithdrawRequest] Запрос на вывод:', {
        telegramId,
        fromAddress,
        toAddress,
        amount
    });
    
    try {
        const requestData = {
            from_address: fromAddress,
            amount: parseFloat(amount),
            to_address: toAddress
        };
        
        console.log('[SendWithdrawRequest] Отправляем запрос:', requestData);
        
        const { data } = await axios.post(API_URL + "/api/wallet/send-withdraw", requestData, {
            headers: {
                "X-Telegram-ID": telegramId,
                "Content-Type": "application/json"
            }
        });
        
        console.log('[SendWithdrawRequest] Ответ сервера:', data);
        return data;
        
    } catch (error) {
        console.error('[SendWithdrawRequest] Ошибка отправки запроса на вывод:', error);
        
        // Обработка различных типов ошибок
        if (error.response?.status === 400) {
            if (error.response.data?.error?.includes('insufficient balance')) {
                throw new Error('Недостаточно средств на балансе');
            } else if (error.response.data?.error?.includes('minimum')) {
                throw new Error('Минимальная сумма вывода: 10.00 USDT');
            } else if (error.response.data?.error?.includes('invalid')) {
                throw new Error('Неверный адрес получателя');
            } else {
                throw new Error('Неверные данные для вывода средств');
            }
        } else if (error.response?.status === 401) {
            throw new Error('Ошибка авторизации. Перезапустите приложение');
        } else if (error.response?.status === 500) {
            throw new Error('Ошибка сервера. Попробуйте позже');
        } else if (!navigator.onLine) {
            throw new Error('Нет подключения к интернету');
        } else {
            throw new Error(error.message || 'Неизвестная ошибка при выводе средств');
        }
    }
}

// УСТАРЕВШАЯ функция - оставляем для обратной совместимости
export const WithdrawWithCommission = async (telegramId, toAddress, amount) => {
    console.warn('[WithdrawWithCommission] УСТАРЕВШАЯ функция! Используйте SendWithdrawRequest');
    
    // Получаем адрес кошелька пользователя для from_address
    try {
        const walletData = await GetWallet(telegramId);
        const fromAddress = walletData.data?.address;
        
        if (!fromAddress) {
            throw new Error('Не удалось получить адрес кошелька');
        }
        
        return await SendWithdrawRequest(telegramId, fromAddress, toAddress, amount);
    } catch (error) {
        console.error('[WithdrawWithCommission] Ошибка:', error);
        throw error;
    }
}