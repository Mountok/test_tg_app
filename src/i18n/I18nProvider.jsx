import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { TelegramInfo } from '../utils/auth';

const I18N_STORAGE_KEY = 'app_lang'; // 'ru' | 'en'

const dictionaries = {
  ru: {
    'settings.title': 'Настройки',
    'settings.parameters': 'Параметры',
    'settings.privacy': 'Приватность',
    'settings.design': 'Оформление',
    'settings.referral.title': 'Реферальная программа',
    'settings.referral.subtitle': 'Приглашайте друзей и зарабатывайте',
    'settings.aboutUs': 'О нас',
    'settings.officialAccounts': 'Официальные аккаунты',
    'settings.faq': 'F.A.Q.',
    'settings.aboutProject': 'О проекте',
    'settings.support': 'Написать в поддержку',
    'settings.logout': 'Выйти из аккаунта',
    'settings.userAgreement': 'Пользовательское соглашение',

    'design.selectLanguage': 'Выберите язык',
    'design.theme': 'Тема',
    'design.theme.light': 'Светлая',
    'design.theme.dark': 'Тёмная',
    'design.theme.system': 'Как в системе',

    'wallet.greeting': 'Добрый день,',
    'wallet.balanceUSDT': 'Баланс в USDT',
    'wallet.topUp': 'Пополнить',
    'wallet.withdraw': 'Вывод',
    'wallet.payByQR': 'Оплатить по QR',
    'favorites.title': 'Избранное',
    'favorites.filter.trending': 'В тренде',
    'favorites.filter.favorites': 'Избранное',
    'favorites.filter.all': 'Все',

    // history
    'history.title': 'История операций',
    'history.empty': 'Нет операций',
    'history.filter.type': 'Тип операции',
    'history.filter.deposit': 'Пополнение',
    'history.filter.payment': 'Оплата',
    'history.filter.period': 'Период',
    'history.filter.day': 'День',
    'history.filter.week': 'Неделя',
    'history.filter.month': 'Месяц',
    'history.filter.sum': 'Сумма',
    'history.filter.sumAsc': 'По возрастанию',
    'history.filter.sumDesc': 'По убыванию',

    // onboarding
    'onboarding.welcomeTitle': 'Добро пожаловать в PlataPay',
    'onboarding.welcomeText': 'сервис для оплаты товаров и услуг через криптовалюту',
    'onboarding.qrTitle': 'Сканируйте QR-код СБП',
    'onboarding.qrText': 'и мы автоматически конвертируем вашу криптовалюту в рубли',
    'onboarding.createTitle': 'Для начала работы нужно создать личный кошелек',
    'onboarding.createText': 'это займет всего несколько секунд',
    'onboarding.createBtn': 'Создать',
    'onboarding.readyTitle': 'Ваш кошелек создан!',
    'onboarding.readyText': 'Чтобы начать пользоваться сервисом, пополните баланс вашего кошелька USDT. После этого вы сможете сканировать QR-коды СБП и совершать покупки.',
    'onboarding.topUpBtn': 'Пополнить баланс',

    // withdraw
    'withdraw.title': 'Вывод USDT',
    'withdraw.availableBalance': 'Доступный баланс',
    'withdraw.recipientAddress': 'Адрес получателя',
    'withdraw.amount': 'Сумма вывода',
    'withdraw.submit': 'Вывести средства',
    'withdraw.processingTime': 'Обработка займет 15-30 секунд',

    // common
    'common.next': 'Далее',
    'common.pleaseWait': 'Пожалуйста, подождите...',
    'common.close': 'Закрыть',

    // qr
    'qr.cameraAccessError': 'Не удалось получить доступ к камере. Проверьте разрешения.',
    'qr.imageProcessError': 'Ошибка обработки изображения',
    'qr.flashNotSupported': 'Фонарик не поддерживается на этом устройстве',
    'qr.flashToggleError': 'Не удалось переключить фонарик',
    'qr.notDetected': 'Не удалось распознать QR-код. Пожалуйста, воспользуйтесь загрузкой фото.',
    'qr.processing': 'Обработка изображения...',
    'qr.hint': 'Можно сканировать QR код с камеры или из галереи',
    'qr.stopCamera': 'Остановить камеру',
    'qr.startCamera': 'Включить камеру',
    'qr.gallery': 'Галерея'
    ,
    // deposit
    'deposit.title': 'Пополнить',
    'deposit.question': 'Каким способом вы хотите',
    'deposit.question2': 'купить криптовалюту',
    'deposit.extWallet': 'Внешний кошелек',
    'deposit.extWalletDesc': 'Перевод с другого кошелька',
    'deposit.soon': 'Скоро',
    'deposit.card': 'Банковская карта',
    'deposit.cardDesc': 'Покупка криптовалюты по карте',
    'deposit.p2p': 'P2P маркет',
    'deposit.p2pDesc': 'Покупка без посредников'
    ,
    // payment modal
    'payment.info': 'Информация о платеже',
    'payment.success': 'Оплата успешно проведена!',
    'payment.amount': 'Сумма',
    'payment.rate': 'Курс обмена',
    'payment.total': 'Итого:',
    'payment.fee': 'Комиссия x%',
    'payment.processing': 'Обработка платежа',
    'payment.pay': 'Оплатить',
    'payment.noBalance': 'Недостаточно баланса',
    'common.back': 'Вернуться назад',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.retry': 'Попробовать снова',
    'common.of': 'из',

    // referral
    'referral.title': 'Партнерская программа',
    'referral.subtitle': 'Получайте до 30% от наших комиссий с платежей каждого приглашенного друга.',
    'referral.createProfileText': 'Для участия в реферальной программе создайте свой профиль.',
    'referral.createProfileBtn': 'Создать реферальную ссылку',
    'referral.yourCode': 'Ваш код:',
    'referral.yourLink': 'Ваша ссылка:',
    'referral.share': 'Поделиться ссылкой',
    'referral.stats': 'Ваша статистика',
    'referral.level': 'Уровень:',
    'referral.commissionRate': 'Ставка комиссии:',
    'referral.active': 'Активные рефералы:',
    'referral.inactive': 'Неактивные рефералы:',
    'referral.available': 'Доступно к выводу:',
    'referral.viewLevels': 'Посмотреть условия',
    'referral.viewList': 'Посмотреть список рефералов',
    'referral.levelsAndTerms': 'Уровни и условия',
    'referral.level1': 'Junior (20%)',
    'referral.level1Req': 'Менее 26 активных рефералов',
    'referral.level2': 'Pro (25%)',
    'referral.level2Req': '26-100 активных рефералов',
    'referral.level3': 'Ambassador (30%)',
    'referral.level3Req': 'Более 100 активных рефералов',
    'referral.activeDefTitle': 'Активный реферал',
    'referral.activeDefText': 'пользователь, совершивший QR-платежей на сумму от 30 USDT за последние 90 дней.',
    'referral.myReferrals': 'Мои рефералы',
    'referral.all': 'Все',
    'referral.activeShort': 'Активные',
    'referral.inactiveShort': 'Неактивные',
    'referral.total': 'Всего рефералов:',
    'referral.empty': 'У вас пока нет рефералов',
    'referral.shareHint': 'Поделитесь своей реферальной ссылкой с друзьями, чтобы начать зарабатывать!',
    'referral.backToProgram': 'Вернуться к реферальной программе',
    'referral.registerDate': 'Дата регистрации',

    // faq
    'faq.title': 'F.A.Q. — Часто задаваемые вопросы',
    'faq.question1': 'Что такое PLATA Pay?',
    'faq.answer1': 'PLATA Pay — это сервис, который позволяет оплачивать покупки криптовалютой USDT через QR-коды СБП, а продавец получает рубли напрямую.',
    'faq.question2': 'Как это работает?',
    'faq.answer2': '1. Вы сканируете QR-код СБП в приложении продавца.\n2. Мы принимаем вашу криптовалюту USDT.\n3. Продавец получает рубли в тот же момент.',
    'faq.question3': 'Нужно ли проходить верификацию?',
    'faq.answer3': 'На текущем этапе — нет. Вы можете пользоваться сервисом сразу после запуска приложения.',
    'faq.question4': 'Какие комиссии?',
    'faq.answer4': 'Комиссия на вывод средств в сети trc-20 (tron) - 4 Usdt',
    'faq.question5': 'Какой курс конвертации?',
    'faq.answer5': 'Курс фиксируется в момент транзакции и отображается в приложении перед подтверждением платежа.',
    'faq.question6': 'В каких странах работает PLATA Pay?',
    'faq.answer6': 'Сейчас работает в Россия.\nНо скоро выйдем на СНГ',
    'faq.question7': 'Какой минимум и максимум для перевода?',
    'faq.answer7': 'Минимальная сумма — 5 USDT, максимальная — зависит от лимитов банка-получателя.',
    'faq.question8': 'Это безопасно?',
    'faq.answer8': 'Да. Все транзакции проходят через защищенные каналы. Криптовалюта хранится только на время обмена и не задерживается на наших счетах.',
    'faq.question9': 'Можно ли использовать PLATA Pay для бизнеса?',
    'faq.answer9': 'Да! Мы уже тестируем функционал для предпринимателей и интернет-магазинов.',
    'faq.question10': 'Куда обращаться при проблемах?',
    'faq.answer10': 'Вы можете написать в нашу службу поддержки:',
    'faq.contactTitle': 'Куда обращаться при проблемах?',

    // about
    'about.title': 'О проекте',
    'about.description1': 'PLATA Pay — это инновационный сервис мгновенных платежей, который объединяет мир криптовалют и привычные фиатные транзакции. Мы помогаем пользователям тратить USDT так же просто, как обычные деньги — в магазинах, онлайн и офлайн, без сложных обменников, комиссий и ожиданий.',
    'about.description2': 'Через наше приложение вы сканируете QR-код СБП, мы принимаем вашу криптовалюту, а продавец получает рубли напрямую. Это быстро, безопасно и легально оформлено как P2С-операция.',
    'about.mission': 'Наша миссия — дать каждому человеку свободу пользоваться своими цифровыми активами в реальной жизни.',
    'about.slogan': 'PLATA Pay — это не просто платежи, это новый уровень финансовой свободы.',
    'about.feature1': 'Мгновенные платежи',
    'about.feature2': 'Безопасные транзакции',
    'about.feature3': 'Легальное оформление'
  },
  en: {
    'settings.title': 'Settings',
    'settings.parameters': 'Parameters',
    'settings.privacy': 'Privacy',
    'settings.design': 'Appearance',
    'settings.referral.title': 'Referral program',
    'settings.referral.subtitle': 'Invite friends and earn',
    'settings.aboutUs': 'About us',
    'settings.officialAccounts': 'Official accounts',
    'settings.faq': 'F.A.Q.',
    'settings.aboutProject': 'About project',
    'settings.support': 'Contact support',
    'settings.logout': 'Log out',
    'settings.userAgreement': 'User Agreement',

    'design.selectLanguage': 'Select language',
    'design.theme': 'Theme',
    'design.theme.light': 'Light',
    'design.theme.dark': 'Dark',
    'design.theme.system': 'System',
    'wallet.balanceInRubles': 'Balance in rubles',
    'wallet.greeting': 'Good day,',
    'wallet.balanceUSDT': 'Balance in USDT',
    'wallet.topUp': 'Top up',
    'wallet.payByQR': 'Pay by QR',
    'favorites.title': 'Favorites',
    'favorites.filter.trending': 'Trending',
    'favorites.filter.favorites': 'Favorites',
    'favorites.filter.all': 'All',

    // history
    'history.title': 'Transactions history',
    'history.empty': 'No transactions',
    'history.filter.type': 'Type',
    'history.filter.deposit': 'Deposit',
    'history.filter.payment': 'Payment',
    'history.filter.period': 'Period',
    'history.filter.day': 'Day',
    'history.filter.week': 'Week',
    'history.filter.month': 'Month',
    'history.filter.sum': 'Amount',
    'history.filter.sumAsc': 'Ascending',
    'history.filter.sumDesc': 'Descending',

    // onboarding
    'onboarding.welcomeTitle': 'Welcome to PlataPay',
    'onboarding.welcomeText': 'a service for paying for goods and services with crypto',
    'onboarding.qrTitle': 'Scan SBP QR code',
    'onboarding.qrText': 'we will automatically convert your crypto to rubles',
    'onboarding.createTitle': 'To get started, create a personal wallet',
    'onboarding.createText': 'it will take just a few seconds',
    'onboarding.createBtn': 'Create',
    'onboarding.readyTitle': 'Your wallet is created!',
    'onboarding.readyText': 'To start using the service, top up your USDT wallet balance. After that you can scan SBP QR codes and make purchases.',
    'onboarding.topUpBtn': 'Top up balance',

    // common
    'common.next': 'Next',
    'common.pleaseWait': 'Please wait...',
    'common.close': 'Close',

    // qr
    'qr.cameraAccessError': 'Failed to access the camera. Check permissions.',
    'qr.imageProcessError': 'Image processing error',
    'qr.flashNotSupported': 'Flashlight is not supported on this device',
    'qr.flashToggleError': 'Failed to toggle flashlight',
    'qr.notDetected': 'Failed to detect QR code. Please try using photo upload.',
    'qr.processing': 'Processing image...',
    'qr.hint': 'You can scan a QR code from the camera or from the gallery',
    'qr.stopCamera': 'Stop camera',
    'qr.startCamera': 'Start camera',
    'qr.gallery': 'Gallery'
    ,
    // deposit
    'deposit.title': 'Top up',
    'deposit.question': 'How would you like to',
    'deposit.question2': 'buy cryptocurrency',
    'deposit.extWallet': 'External wallet',
    'deposit.extWalletDesc': 'Transfer from another wallet',
    'deposit.soon': 'Soon',
    'deposit.card': 'Bank card',
    'deposit.cardDesc': 'Buy crypto by card',
    'deposit.p2p': 'P2P market',
    'deposit.p2pDesc': 'Peer-to-peer purchase'
    ,
    // payment modal
    'payment.info': 'Payment information',
    'payment.success': 'Payment completed successfully!',
    'payment.amount': 'Amount',
    'payment.rate': 'Exchange rate',
    'payment.total': 'Total:',
    'payment.fee': 'Fee x%',
    'payment.processing': 'Processing payment',
    'payment.pay': 'Pay',
    'payment.noBalance': 'Insufficient balance',
    'common.back': 'Go back',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Try again',
    'common.of': 'of',

    // referral
    'referral.title': 'Referral program',
    'referral.subtitle': 'Get up to 30% of our fees from each invited friend’s payments.',
    'referral.createProfileText': 'To participate in the referral program, create your profile.',
    'referral.createProfileBtn': 'Create referral link',
    'referral.yourCode': 'Your code:',
    'referral.yourLink': 'Your link:',
    'referral.share': 'Share link',
    'referral.stats': 'Your statistics',
    'referral.level': 'Level:',
    'referral.commissionRate': 'Commission rate:',
    'referral.active': 'Active referrals:',
    'referral.inactive': 'Inactive referrals:',
    'referral.available': 'Available to withdraw:',
    'referral.viewLevels': 'View terms',
    'referral.viewList': 'View referral list',
    'referral.levelsAndTerms': 'Levels and terms',
    'referral.level1': 'Junior (20%)',
    'referral.level1Req': 'Less than 26 active referrals',
    'referral.level2': 'Pro (25%)',
    'referral.level2Req': '26-100 active referrals',
    'referral.level3': 'Ambassador (30%)',
    'referral.level3Req': 'More than 100 active referrals',
    'referral.activeDefTitle': 'Active referral',
    'referral.activeDefText': 'a user who made QR payments totaling at least 30 USDT in the last 90 days.',
    'referral.myReferrals': 'My referrals',
    'referral.all': 'All',
    'referral.activeShort': 'Active',
    'referral.inactiveShort': 'Inactive',
    'referral.total': 'Total referrals:',
    'referral.empty': 'You have no referrals yet',
    'referral.shareHint': 'Share your referral link with friends to start earning!',
    'referral.backToProgram': 'Back to referral program',
    'referral.registerDate': 'Registration date',

    // faq
    'faq.title': 'F.A.Q. — Frequently Asked Questions',
    'faq.question1': 'What is PLATA Pay?',
    'faq.answer1': 'PLATA Pay is a service that allows you to pay for purchases with USDT cryptocurrency through SBP QR codes, while the seller receives rubles directly.',
    'faq.question2': 'How does it work?',
    'faq.answer2': '1. You scan the SBP QR code in the seller\'s app.\n2. We accept your USDT cryptocurrency.\n3. The seller receives rubles instantly.',
    'faq.question3': 'Do I need to complete verification?',
    'faq.answer3': 'At the current stage - no. You can use the service immediately after launching the app.',
    'faq.question4': 'What are the fees?',
    'faq.answer4': 'Withdrawal fee in the trc-20 (tron) network - 4 USDT',
    'faq.question5': 'What is the conversion rate?',
    'faq.answer5': 'The rate is fixed at the moment of transaction and displayed in the app before payment confirmation.',
    'faq.question6': 'In which countries does PLATA Pay work?',
    'faq.answer6': 'Currently works in Russia.\nBut we will soon expand to CIS countries',
    'faq.question7': 'What are the minimum and maximum transfer amounts?',
    'faq.answer7': 'Minimum amount is 5 USDT, maximum depends on the recipient bank\'s limits.',
    'faq.question8': 'Is it safe?',
    'faq.answer8': 'Yes. All transactions go through secure channels. Cryptocurrency is stored only during the exchange and is not held in our accounts.',
    'faq.question9': 'Can PLATA Pay be used for business?',
    'faq.answer9': 'Yes! We are already testing functionality for entrepreneurs and online stores.',
    'faq.question10': 'Where to contact for problems?',
    'faq.answer10': 'You can contact our support service:',
    'faq.contactTitle': 'Where to contact for problems?',

    // about
    'about.title': 'About Project',
    'about.description1': 'PLATA Pay is an innovative instant payment service that connects the world of cryptocurrencies and traditional fiat transactions. We help users spend USDT as easily as regular money — in stores, online and offline, without complex exchanges, fees and waiting.',
    'about.description2': 'Through our app you scan the SBP QR code, we accept your cryptocurrency, and the seller receives rubles directly. It\'s fast, secure and legally formatted as a P2C operation.',
    'about.mission': 'Our mission is to give every person the freedom to use their digital assets in real life.',
    'about.slogan': 'PLATA Pay is not just payments, it\'s a new level of financial freedom.',
    'about.feature1': 'Instant payments',
    'about.feature2': 'Secure transactions',
    'about.feature3': 'Legal compliance'
  },
};

const I18nContext = createContext({
  lang: 'ru',
  setLanguage: () => {},
  t: (key) => key,
});

function detectInitialLang() {
  try {
    const stored = localStorage.getItem(I18N_STORAGE_KEY);
    if (stored === 'ru' || stored === 'en') return stored;
  } catch {}
  // Try Telegram
  try {
    const tgUser = TelegramInfo?.();
    const langCode = tgUser?.language_code?.toLowerCase();
    if (langCode?.startsWith('ru')) return 'ru';
    if (langCode?.startsWith('en')) return 'en';
  } catch {}
  // Fallback by browser
  const navLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  if (navLang.startsWith('ru')) return 'ru';
  return 'en';
}

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(detectInitialLang());

  useEffect(() => {
    try { localStorage.setItem(I18N_STORAGE_KEY, lang); } catch {}
  }, [lang]);

  const dict = dictionaries[lang] || dictionaries.en;
  const t = useMemo(() => (key) => dict[key] ?? key, [dict]);

  const setLanguage = (l) => {
    if (l === 'ru' || l === 'en') setLang(l);
  };

  const value = useMemo(() => ({ lang, setLanguage, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);

