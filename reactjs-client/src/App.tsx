import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { ApplicationPage } from './pages/ApplicationPage';
import { useAuth } from './hooks/useAuth';
import './App.css';

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

export default App;