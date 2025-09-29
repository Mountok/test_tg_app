import axios from "axios"


const API_URL = "https://plataplay.duckdns.org";
// const API_URL = "http://localhost:8880";


export const ConvertRUBToUSDT = async (QRLink, options = {}) => {
  try {
    const { amountRub: overrideAmountRub, from: overrideFrom } = options;

    let amount;
    let fromCurrency = overrideFrom || 'RUB';

    if (typeof overrideAmountRub === 'number' && !isNaN(overrideAmountRub) && overrideAmountRub > 0) {
      // Используем ручной ввод суммы напрямую
      amount = overrideAmountRub;
    } else {
      // Пытаемся извлечь сумму из QR-ссылки
      const url = new URL(QRLink);
      const params = new URLSearchParams(url.search);

      console.log(url)

      const sumParam = params.get('sum') || params.get('amount');
      const currency = params.get('cur') || 'RUB';
      const bank = params.get('bank');
      fromCurrency = currency || fromCurrency;

      console.log(sumParam)
      if (!sumParam) throw new Error('MISSING_AMOUNT');
      
      // Проверяем, является ли это multiqr.ru - там суммы уже в рублях
      const isMultiQR = url.hostname === 'multiqr.ru';
      const isNSPK = url.hostname === 'qr.nspk.ru';
      
      // Проверяем, содержит ли сумма десятичную точку (уже в рублях)
      const hasDecimalPoint = sumParam.includes('.');
      
      amount = parseFloat(sumParam);
      if (isNSPK && bank === '100000000005') {
        // Для этого банка всегда копейки
        amount = amount / 100;
      } else if (!hasDecimalPoint && amount > 10000) {
        // Общая эвристика для остальных
        amount = amount / 100;
      }

      console.log('Проверка суммы:', {
        sumParam: sumParam,
        isMultiQR: isMultiQR,
        isNSPK: isNSPK,
        hasDecimalPoint: hasDecimalPoint
      });

      console.log('Результат обработки:', {
        исходнаяСумма: sumParam,
        итоговаяСумма: amount,
        делениеНа100: !hasDecimalPoint && parseFloat(sumParam) > 10000,
        причина: hasDecimalPoint ? 'уже в рублях' : (parseFloat(sumParam) > 10000 ? 'эвристика: копейки' : 'эвристика: рубли')
      });
    }

    const response = await axios.post(API_URL+'/api/wallet/convert', {
      amount,
      from: fromCurrency,
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
    if (error?.message === 'MISSING_AMOUNT') {
      // Пробрасываем специальную ошибку, чтобы UI мог открыть модалку ввода суммы
      throw error;
    }
    return null;
  }
};