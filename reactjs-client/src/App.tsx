import React, { useState, useContext, createContext, useEffect } from 'react';
import './App.css';
import { validateEmail, validateName, validatePassword } from './utils/validations';
import { User, AuthContextType, FormErrors } from './types/auth.types';
import authService from './services/auth.service';

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const storedToken = authService.getStoredToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signin({ email, password });
      if (result.user && result.access_token) {
        setUser(result.user);
        authService.setTokenAndUser(result.access_token, result.user);
        return true;
      } else {
        setError('Login failed');
        return false;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signup({ email, name, password });
      if (result.user && result.access_token) {
        setUser(result.user);
        authService.setTokenAndUser(result.access_token, result.user);
        return true;
      } else {
        setError('Signup failed');
        return false;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Input Component
const Input: React.FC<{
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}> = ({ type, placeholder, value, onChange, error, disabled }) => (
  <div className="mb-4">
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${error
        ? 'border-red-500 bg-red-50'
        : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Button Component
const Button: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}> = ({ children, onClick, disabled, loading, variant = 'primary' }) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled || loading}
    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500'
      } ${disabled || loading
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:shadow-lg transform hover:-translate-y-0.5'
      }`}
  >
    {loading ? (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        Loading...
      </div>
    ) : (
      children
    )}
  </button>
);

// Sign Up Page
const SignUpPage: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us and start your journey</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

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

        <div className="mb-6">
          <Button onClick={handleSubmit} disabled={loading} loading={loading}>
            Create Account
          </Button>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Sign In Page
const SignInPage: React.FC<{ onSwitchToSignUp: () => void }> = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const newErrors: FormErrors = {};

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await login(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          disabled={loading}
        />

        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          disabled={loading}
        />

        <div className="mb-6">
          <Button onClick={handleSubmit} disabled={loading} loading={loading}>
            Sign In
          </Button>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Application Page (Protected)
const ApplicationPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Auth App</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {user?.name}</span>
              <Button onClick={logout} variant="secondary">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-32 h-32 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to the application.
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            You have successfully signed in to our platform. Explore the features and enjoy your experience!
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Profile</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="text-gray-900">{user?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-900">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-700">User ID:</span>
                <span className="text-gray-900 font-mono text-sm">{user?.id}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup'>('login');

  return (
    <AuthProvider>
      <AuthContent
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </AuthProvider>
  );
};

// Auth Content Component
const AuthContent: React.FC<{
  currentPage: 'login' | 'signup';
  setCurrentPage: (page: 'login' | 'signup') => void;
}> = ({ currentPage, setCurrentPage }) => {
  const { user } = useAuth();

  if (user) {
    return <ApplicationPage />;
  }

  if (currentPage === 'signup') {
    return <SignUpPage onSwitchToLogin={() => setCurrentPage('login')} />;
  }

  return <SignInPage onSwitchToSignUp={() => setCurrentPage('signup')} />;
};

export default App;