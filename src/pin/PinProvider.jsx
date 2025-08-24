import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PinSetupModal from '../Components/UI/PinSetupModal.jsx';
import PinEnterModal from '../Components/UI/PinEnterModal.jsx';

const PIN_KEY = 'pin.v1';
const ITERATIONS = 150000;
const MAX_LOCK_MS = 15 * 60 * 1000; // 15 minutes
const BASE_LOCK_MS = 30 * 1000; // 30 seconds
const SESSION_IDLE_MS = 5 * 60 * 1000; // 5 minutes
const PIN_LENGTH = 4;

const PinContext = createContext(null);

function base64FromArrayBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function arrayBufferFromBase64(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function pbkdf2Hash(pin, saltB64, iterations) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(pin),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const salt = arrayBufferFromBase64(saltB64);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    keyMaterial,
    256
  );
  return base64FromArrayBuffer(bits);
}

function hasLocalStorage() {
  try {
    const k = '__pin_test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch (_) {
    return false;
  }
}

function generateSaltB64() {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return base64FromArrayBuffer(salt.buffer);
}

function computeLockMs(failedAttempts) {
  if (failedAttempts < 5) return 0;
  const over = failedAttempts - 5; // 0-based after threshold
  const lock = Math.min(MAX_LOCK_MS, BASE_LOCK_MS * (2 ** over));
  return lock;
}

export function PinProvider({ children }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showEnter, setShowEnter] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [envUnavailable, setEnvUnavailable] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const ensureUnlockPromiseRef = useRef(null);
  const lastActiveRef = useRef(Date.now());

  // Load initial state
  useEffect(() => {
    if (!hasLocalStorage()) {
      setEnvUnavailable(true);
      setInitialized(true);
      return;
    }
    try {
      const raw = localStorage.getItem(PIN_KEY);
      if (!raw) {
        setIsEnabled(false);
        setIsUnlocked(true);
        setInitialized(true);
        return;
      }
      const parsed = JSON.parse(raw);
      setIsEnabled(true);
      setFailedAttempts(Number(parsed.failedAttempts || 0));
      setLockedUntil(Number(parsed.lockedUntil || 0));
      setIsUnlocked(false);
      setInitialized(true);
    } catch (_) {
      // Corrupted data
      localStorage.removeItem(PIN_KEY);
      setIsEnabled(false);
      setIsUnlocked(true);
      setInitialized(true);
    }
  }, []);

  const isPinEnabled = useCallback(async () => {
    if (!hasLocalStorage()) throw new Error('PIN недоступен в этом окружении');
    const raw = localStorage.getItem(PIN_KEY);
    return Boolean(raw);
  }, []);

  const enablePin = useCallback(async (pin) => {
    if (!hasLocalStorage()) throw new Error('PIN недоступен в этом окружении');
    if (!/^[0-9]{4}$/.test(pin)) throw new Error('PIN должен состоять из 4 цифр');
    const salt = generateSaltB64();
    const hash = await pbkdf2Hash(pin, salt, ITERATIONS);
    const payload = {
      salt,
      hash,
      iterations: ITERATIONS,
      failedAttempts: 0,
      lockedUntil: 0,
    };
    localStorage.setItem(PIN_KEY, JSON.stringify(payload));
    setIsEnabled(true);
    setIsUnlocked(true);
    setFailedAttempts(0);
    setLockedUntil(0);
  }, []);

  const verifyPin = useCallback(async (pin) => {
    if (!hasLocalStorage()) throw new Error('PIN недоступен в этом окружении');
    const now = Date.now();
    const raw = localStorage.getItem(PIN_KEY);
    if (!raw) {
      setIsEnabled(false);
      setIsUnlocked(true);
      return true;
    }
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      localStorage.removeItem(PIN_KEY);
      setIsEnabled(false);
      setIsUnlocked(true);
      return true;
    }

    const currentLockedUntil = Number(data.lockedUntil || 0);
    if (now < currentLockedUntil) {
      setLockedUntil(currentLockedUntil);
      return false;
    }

    const computed = await pbkdf2Hash(pin, data.salt, Number(data.iterations || ITERATIONS));
    if (computed === data.hash) {
      // success
      const updated = { ...data, failedAttempts: 0, lockedUntil: 0 };
      localStorage.setItem(PIN_KEY, JSON.stringify(updated));
      setFailedAttempts(0);
      setLockedUntil(0);
      setIsUnlocked(true);
      return true;
    }

    // failure
    const nextFailed = Number(data.failedAttempts || 0) + 1;
    const lockMs = computeLockMs(nextFailed);
    const nextLockedUntil = lockMs ? now + lockMs : 0;
    const updated = { ...data, failedAttempts: nextFailed, lockedUntil: nextLockedUntil };
    localStorage.setItem(PIN_KEY, JSON.stringify(updated));
    setFailedAttempts(nextFailed);
    setLockedUntil(nextLockedUntil);
    return false;
  }, []);

  const disablePin = useCallback(async (pin) => {
    const ok = await verifyPin(pin);
    if (!ok) throw new Error('Неверный PIN');
    localStorage.removeItem(PIN_KEY);
    setIsEnabled(false);
    setIsUnlocked(true);
    setFailedAttempts(0);
    setLockedUntil(0);
  }, [verifyPin]);

  const lock = useCallback(() => {
    if (!isEnabled) return;
    setIsUnlocked(false);
  }, [isEnabled]);

  const ensureUnlocked = useCallback(async () => {
    if (!isEnabled) {
      setIsUnlocked(true);
      return;
    }
    if (isUnlocked) return;
    // Show enter modal and wait until unlocked
    setShowEnter(true);
    if (!ensureUnlockPromiseRef.current) {
      ensureUnlockPromiseRef.current = new Promise((resolve) => {
        const interval = setInterval(() => {
          if (isUnlocked) {
            clearInterval(interval);
            ensureUnlockPromiseRef.current = null;
            resolve();
          }
        }, 100);
      });
    }
    await ensureUnlockPromiseRef.current;
  }, [isEnabled, isUnlocked]);

  // Автовызов модалки ввода PIN при старте, если включен PIN
  useEffect(() => {
    if (!initialized) return;
    if (isEnabled && !isUnlocked) {
      setShowEnter(true);
    }
  }, [initialized, isEnabled, isUnlocked]);

  // Idle/visibility handling
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        if (now - lastActiveRef.current > SESSION_IDLE_MS) {
          lock();
        }
        ensureUnlocked();
      }
    };
    const onActivity = () => {
      lastActiveRef.current = Date.now();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('touchstart', onActivity, { passive: true });
    window.addEventListener('click', onActivity, { passive: true });
    window.addEventListener('keydown', onActivity);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('touchstart', onActivity);
      window.removeEventListener('click', onActivity);
      window.removeEventListener('keydown', onActivity);
    };
  }, [ensureUnlocked, lock]);

  const value = useMemo(() => ({
    envUnavailable,
    isPinEnabled,
    enablePin,
    verifyPin,
    disablePin,
    ensureUnlocked,
    lock,
    isEnabled,
    isUnlocked,
    setShowSetup, // expose for UI toggle to open setup
    setShowEnter,
    failedAttempts,
    lockedUntil,
    setIsUnlocked,
  }), [envUnavailable, isPinEnabled, enablePin, verifyPin, disablePin, ensureUnlocked, lock, isEnabled, isUnlocked, failedAttempts, lockedUntil]);

  return (
    <PinContext.Provider value={value}>
      {children}
      {/* UI Modals */}
      <PinSetupModal isOpen={showSetup} onClose={() => setShowSetup(false)} onSet={enablePin} pinLength={PIN_LENGTH} />
      <PinEnterModal
        isOpen={showEnter && isEnabled && !isUnlocked}
        onClose={() => {}}
        onVerify={async (pin) => {
          const ok = await verifyPin(pin);
          if (ok) {
            setShowEnter(false);
          }
          return ok;
        }}
        onLogout={async () => {
          try {
            localStorage.removeItem(PIN_KEY);
            setIsEnabled(false);
            setIsUnlocked(true);
          } catch (_) {}
          try {
            window?.Telegram?.WebApp?.close?.();
          } catch (_) {}
        }}
        failedAttempts={failedAttempts}
        lockedUntil={lockedUntil}
        pinLength={PIN_LENGTH}
      />
    </PinContext.Provider>
  );
}

export function usePin() {
  const ctx = useContext(PinContext);
  if (!ctx) throw new Error('usePin must be used within PinProvider');
  return ctx;
}