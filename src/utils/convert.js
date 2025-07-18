import axios from "axios"


const API_URL = "https://plataplay.duckdns.org";
// const API_URL = "http://localhost:8880";


export const ConvertRUBToUSDT = async (QRLink) => {
  try {
    const url = new URL(QRLink);
    const params = new URLSearchParams(url.search);

    const sumParam = params.get('sum') || params.get('amount');
    const currency = params.get('cur') || 'RUB';
    console.log(sumParam)
    if (!sumParam) throw new Error('Параметр sum не найден в QR-ссылке');
    
    // Проверяем, является ли это multiqr.ru - там суммы уже в рублях
    const isMultiQR = url.hostname === 'multiqr.ru';
    const amount = isMultiQR 
      ? parseFloat(sumParam) // для multiqr.ru сумма уже в рублях
      : parseFloat(sumParam) / 100; // для СБП и других - из копеек в рубли

    const response = await axios.post(API_URL+'/api/wallet/convert', {
      amount,
      from: currency,
      to: 'USDT'
    },{
        headers: {
            "X-Telegram-ID": "123456789"
        }
    });

    // const response = await axios.post('https://plataplay.duckdns.org/api/wallet/convert', {
    //   amount,
    //   from: currency,
    //   to: 'USDT'
    // },{
    //     headers: {
    //         "X-Telegram-ID": "123456789"
    //     }
    // });

    const data = response.data?.data;

    return {
      amountRub: amount,
      amountUsdt: parseFloat(data.convertedAmount.toFixed(4)),
      wallet: data.wallet,
      message: data.message
    };
  } catch (error) {
    console.error('Ошибка при конвертации QR-ссылки:', error);
    return null;
  }
};