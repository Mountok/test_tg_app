import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal.jsx';
import PinPad from './PinPad.jsx';

export default function PinEnterModal({ isOpen, onClose, onVerify, onLogout, failedAttempts, lockedUntil, pinLength = 4 }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [now, setNow] = useState(Date.now());
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 0);
      const t = setInterval(() => setNow(Date.now()), 250);
      return () => clearInterval(t);
    }
  }, [isOpen]);

  const remainingMs = Math.max(0, (lockedUntil || 0) - now);
  const remainingText = useMemo(() => {
    if (remainingMs <= 0) return '';
    const s = Math.ceil(remainingMs / 1000);
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }, [remainingMs]);

  useEffect(() => {
    if (pin.length >= pinLength) handleSubmit();
  }, [pin, pinLength]);

  const handleSubmit = async () => {
    if (remainingMs > 0) return;
    try {
      const ok = await onVerify(pin);
      if (!ok) {
        setError('Неверный PIN');
        setPin('');
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    } catch (e) {
      setError(e?.message || 'Ошибка');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={'Введите PIN'} showCloseButton={false}>
      <div className="pin-modal">
        <PinPad value={pin} onChange={setPin} disabled={remainingMs > 0} length={pinLength} />
        {failedAttempts > 0 && remainingMs <= 0 && (
          <div className="pin-attempts">Попытки: {failedAttempts}</div>
        )}
        {remainingMs > 0 && (
          <div className="pin-lock">Блокировка: {remainingText}</div>
        )}
        {error && <div className="pin-error">{error}</div>}
        <button className="btn-logout" onClick={onLogout}>Выйти</button>
      </div>
    </Modal>
  );
}


