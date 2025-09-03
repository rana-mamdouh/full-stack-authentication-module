import React from 'react';

// Input Component
export const Input: React.FC<{
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}> = ({ type, placeholder, value, onChange, error, disabled }) => (
  <div className="input-group">
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`input ${error ? 'error' : ''}`}
    />
    {error && <p className="error-message">{error}</p>}
  </div>
);

// Button Component
export const Button: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'logout';
}> = ({ children, onClick, disabled, loading, variant = 'primary' }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`btn btn-${variant}`}
  >
    {loading ? (
      <div className="btn-loading">
        <div className="spinner"></div>
        Loading...
      </div>
    ) : (
      children
    )}
  </button>
);