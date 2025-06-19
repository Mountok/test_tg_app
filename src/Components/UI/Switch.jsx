import React from 'react';
import './Switch.css';

const Switch = ({ checked, onChange, disabled }) => (
  <label className={`custom-switch${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      disabled={disabled}
    />
    <span className="switch-slider" />
  </label>
);

export default Switch; 