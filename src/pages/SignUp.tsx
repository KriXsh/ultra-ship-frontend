import React, { useState } from 'react';
import { User, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';

export interface SignUpData {
  username: string;
  password: string;
}

interface SignUpProps {
  onSuccess: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<SignUpData>({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.signUp(formData);
      
      if (response.code === 201) {
        localStorage.setItem('token', response.token);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <User size={40} />
          </div>
          <h1>Employee Portal</h1>
          <p>Sign up to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-container">
              <User className="input-icon" size={20} />
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <Lock className="input-icon" size={20} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner-small"></div>
                Signing up...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Sign Up
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Create an admin account to get started</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;