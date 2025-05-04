import axios from "axios"




export const ConvertRUBToUSDT = async (QRLink) => {
  try {
    const url = new URL(QRLink);
    const params = new URLSearchParams(url.search);

    const sumParam = params.get('sum');
    const currency = params.get('cur') || 'RUB';

    if (!sumParam) throw new Error('Параметр sum не найден в QR-ссылке');

    const amount = parseFloat(sumParam) / 100; // из копеек → в рубли

    const response = await axios.post('https://plataplay.duckdns.org/api/wallet/convert', {
      amount,
      from: currency,
      to: 'USDT'
    },{
        headers: {
            "X-Telegram-ID": "123456789"
        }
    });

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