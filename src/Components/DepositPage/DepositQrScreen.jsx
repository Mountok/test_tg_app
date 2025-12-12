import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import TronIcon from './TronIcon';
import './Deposit.css';
// Для генерации QR-кода
import { QRCode } from 'react-qrcode-logo';

const DepositQrScreen = ({ walletAddr, onBack, onCopy }) => {
  // адаптивные размеры
  const [height, setHeight] = React.useState(window.innerHeight);
  React.useEffect(() => {
    const onResize = () => setHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  // qrSize подбираем под высоту
  let qrSize = 220;
  if (height < 700) qrSize = 170;
  else if (height < 800) qrSize = 190;
  // паддинги нижних блоков
  const blockPadding = height < 700 ? '10px 4px 10px 4px' : '18px 12px 18px 12px';
  const qrcodeBlockRadius = height < 700 ? 17 : 32;
  return (
    <div className="deposit-bg" style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'flex-start', alignItems:'center', padding:0, background:'#000', width:'100vw', overflowY:'auto'}}>
      {/* Header */}
      <div className="deposit-header" style={{background:'transparent',boxShadow:'none',padding:'0 0 0 0',marginBottom:height<700?2:8}}>
        <button className="deposit-back-btn" onClick={onBack}>
          <FiArrowLeft />
        </button>
        <div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',marginTop:0,paddingTop:height<700?2:6}}>
          <span className="deposit-qr-title-row" style={{display:'flex',alignItems:'center',gap:6,fontWeight:600,fontSize:height<700?15:19}}>
            <span className="deposit-qr-title-icon">
              <img src="/svg/tether_logo.svg" width={height<700?15:20} height={height<700?15:20} alt="Tether Logo" />
            </span>
            Пополнение USDT
          </span>
        </div>
      </div>
      {/* QR (адаптивный) */}
      <div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',marginTop:height<700?9:18}}>
        <div style={{background:'#181818',borderRadius:qrcodeBlockRadius,padding:blockPadding,width:'98vw',maxWidth:400,margin:'0 auto',display:'flex',flexDirection:'column',alignItems:'center',boxShadow:'0 4px 32px #0003'}}>
          <QRCode
            value={walletAddr}
            size={qrSize}
            logoImage="/usdt-tron-logo.png"
            logoWidth={qrSize/4}
            logoHeight={qrSize/4}
            logoOpacity={1}
            eyeRadius={8}
            bgColor="#181818"
            fgColor="#fff"
          />
          <div style={{color:'#C5C5C5',fontSize:height<700?14:16,fontWeight:400,marginTop:height<700?8:18,marginBottom:-8,textAlign:'center'}}>
            Отсканируйте QR-код для отправки активов на ваш кошелек
          </div>
        </div>
      </div>
      {/* Адрес и предупреждение */}
      <div style={{ width:'98vw',maxWidth:400,margin:'8px auto 0 auto',background:'#181818',borderRadius:height<700?13:22,padding:blockPadding,display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div className="deposit-qr-address-label" style={{color:'#B5B5B5',fontSize:height<700?11:12}}>Ваш адрес USDT в сети TRC20</div>
        <div className="deposit-qr-address" style={{fontWeight:500,fontSize:height<700?11:12,marginTop:4,marginBottom:7,wordBreak:'break-all'}}>{walletAddr}</div>
        <div className="deposit-qr-warning" style={{color:'#C5C5C5',fontSize:height<700?9:11,lineHeight:'1.35',marginBottom:8,textAlign:'center'}}>
          Данный адрес предназначен только для получения USDT в сети TRC20. Отправка других активов приведёт к их безвозвратной потере!
        </div>
        <div className="deposit-qr-min-amount-warn" style={{ color: 'red', fontWeight: 500, fontSize: height<700?9:11, textAlign:'center', maxWidth:'100%', whiteSpace: 'pre-line', wordBreak: 'break-word', marginTop: 1, lineHeight: 1.3 }}>
          Минимальная сумма пополнения: <span style={{fontWeight:600}}>5 USDT</span>. Меньшие суммы не отображаются!
        </div>
      </div>
      {/* Spacer между адрес-частью и кнопками, от 30px, увеличиваем на маленьких экранах */}
      <div style={{height:height<700?34:height<800?24:40}} />
      {/* Кнопки (адаптив) */}
      <div className="deposit-qr-btns-fixed" style={{marginTop:height<700?3:10,marginBottom:height<700?6:12,display:'flex',flexDirection:'column',width:'98vw',maxWidth:400,marginLeft:'auto',marginRight:'auto',gap:height<700?5:10}}>
        <button className="deposit-network-continue-btn deposit-qr-copy-btn" style={{background:'#FFE500',color:'#222',fontWeight:600,fontSize:height<700?13:16,borderRadius:height<700?9:15,padding:height<700?'8px 0':'13px 0'}} onClick={()=>onCopy(walletAddr)}>Копировать адрес</button>
        <button className="deposit-option-btn deposit-qr-back-btn" style={{background:'#262626',color:'#fff',fontWeight:600,fontSize:height<700?13:16,borderRadius:height<700?9:15,padding:height<700?'8px 0':'13px 0'}} onClick={onBack}>Вернуться назад</button>
      </div>
    </div>
  );
};

export default DepositQrScreen; 