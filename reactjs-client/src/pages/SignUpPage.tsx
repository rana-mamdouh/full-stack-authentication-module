import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Input, Button } from '../components/AuthComponents';

// Types
interface FormErrors {
  email?: string;
  name?: string;
  password?: string;
  general?: string;
}

// Validation functions
const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return undefined;
};

const validateName = (name: string): string | undefined => {
  if (!name) return 'Name is required';
  if (name.length < 3) return 'Name must be at least 3 characters long';
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!/[a-zA-Z]/.test(password)) return 'Password must contain at least one letter';
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    return 'Password must contain at least one special character';
  return undefined;
};

export const SignUpPage: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const { signup, loading, error } = useAuth();

  const handleSubmit = async () => {
    // Validate all fields
    const newErrors: FormErrors = {};
    
    const emailError = validateEmail(email);
    const nameError = validateName(name);
    const passwordError = validatePassword(password);
    
    if (emailError) newErrors.email = emailError;
    if (nameError) newErrors.name = nameError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    
    // If no validation errors, attempt signup
    if (Object.keys(newErrors).length === 0) {
      await signup(email, name, password);
    }
  };

  return (
    <div className="page-container signup-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon signup">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us and start your journey</p>
        </div>

        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        <div className="form-group">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            disabled={loading}
          />

          <Input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={setName}
            error={errors.name}
            disabled={loading}
          />

          <Input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            disabled={loading}
          />

          <Button onClick={handleSubmit} disabled={loading} loading={loading}>
            Create Account
          </Button>
        </div>

        <div className="auth-links">
          <p>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="auth-link login"
            >
              Sign in
            </button>
          </p>
          
          <div className="info-box demo">
            <strong>Demo:</strong> Creates accounts in demo mode or connects to backend at localhost:3001
          </div>
        </div>
      </div>
    </div>
  );
};