import React, { useState, useEffect, lazy, Suspense } from 'react';
import './App.css';
import LoadingSpinner from './components/LoadingSpinner';
import Sidebar from './components/Sidebar';

// Lazy load components
const SignUp = lazy(() => import('./pages/SignUp'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      {isAuthenticated ? (
        <div className="dashboard-layout">
          <Sidebar onLogout={handleLogout} />
          <main className="main-content">
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard onLogout={handleLogout} />
            </Suspense>
          </main>
        </div>
      ) : (
        <Suspense fallback={<LoadingSpinner />}>
          <SignUp onSuccess={handleAuthSuccess} />
        </Suspense>
      )}
    </div>
  );
}

export default App;