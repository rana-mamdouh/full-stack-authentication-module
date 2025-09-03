import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/AuthComponents';

export const ApplicationPage: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-brand">
                        <div className="navbar-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="navbar-title">Auth App</span>
                    </div>
                    <div className="navbar-user">
                        <span className="navbar-greeting">Hello, {user?.name}</span>
                        <Button onClick={logout} variant="secondary">
                            Logout
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <div className="app-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h1 className="welcome-title">
                    Welcome to the application!
                </h1>

                <p className="welcome-subtitle">
                    You have successfully signed in to our platform. Explore the features and enjoy your experience!
                </p>

                <div className="profile-card">
                    <div className="profile-section">
                        <h2>Your Profile</h2>
                        <div>
                            <div className="profile-item">
                                <span className="profile-label">Name:</span>
                                <span className="profile-value">{user?.name}</span>
                            </div>
                            <div className="profile-item">
                                <span className="profile-label">Email:</span>
                                <span className="profile-value">{user?.email}</span>
                            </div>
                            <div className="profile-item">
                                <span className="profile-label">User ID:</span>
                                <span className="profile-value mono">{user?.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="info-box success">
                    <p>
                        🎉 <strong>Connected:</strong> Successfully connected to your NestJS API at{' '}
                        <code>http://localhost:3001</code>
                    </p>
                </div>
            </main>
        </div>
    );
};
