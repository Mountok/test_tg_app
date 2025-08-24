import React, { useEffect, useRef, useState } from 'react';
import Modal from './Modal.jsx';
import PinPad from './PinPad.jsx';
import { showToast } from './Toast.jsx';

export default function PinSetupModal({ isOpen, onClose, onSet, pinLength = 4 }) {
  const [step, setStep] = useState(1);
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPin1('');
      setPin2('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    const v = step === 1 ? pin1 : pin2;
    if (v.length >= pinLength) handleSubmit();
  }, [pin1, pin2, pinLength]);

  const handleSubmit = async () => {
    if (step === 1) {
      setStep(2);
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }
    if (pin1 !== pin2) {
      setError('PIN не совпадает');
      setStep(1);
      setPin1('');
      setPin2('');
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }
    try {
      await onSet(pin1);
      showToast('PIN‑код успешно установлен', 'success');
      onClose();
    } catch (e) {
      setError(e?.message || 'Ошибка');
    }
  };

  const value = step === 1 ? pin1 : pin2;
  const setValue = step === 1 ? setPin1 : setPin2;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={step === 1 ? 'Добавьте пин‑код' : 'Введите код еще раз'}>
      <div className="pin-modal">
        <PinPad value={value} onChange={setValue} length={pinLength} />
        {error && <div className="pin-error">{error}</div>}
      </div>
    </Modal>
  );
}


