import React from 'react';

export default function PinPad({ value, length = 4, onChange, disabled }) {
  const handleKey = (digit) => {
    if (disabled) return;
    if (digit === 'back') {
      onChange(value.slice(0, -1));
      return;
    }
    if (value.length >= length) return;
    onChange((value + digit).slice(0, length));
  };

  const cells = ['1','2','3','4','5','6','7','8','9','','0','back'];

  return (
    <div className="pinpad">
      <div className="pin-dots">
        {Array.from({ length }).map((_, i) => (
          <span key={i} className={`pin-dot${i < value.length ? ' filled' : ''}`} />
        ))}
      </div>
      <div className="pin-grid">
        {cells.map((c, idx) => {
          if (c === '') return <div key={idx} />;
          const isBack = c === 'back';
          return (
            <button
              key={idx}
              className={`pin-key${isBack ? ' back' : ''}`}
              onClick={() => handleKey(isBack ? 'back' : c)}
              disabled={disabled}
            >
              {isBack ? '×' : c}
            </button>
          );
        })}
      </div>
    </div>
  );
}


