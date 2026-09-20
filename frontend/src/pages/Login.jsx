import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login({ showToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'ROLE_ADMIN',
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleQuickFill = () => {
    setFormData({
      username: 'admin',
      password: 'admin123',
      fullName: 'Administrator',
      role: 'ROLE_ADMIN',
    });
    if (isRegister) setIsRegister(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!formData.fullName.trim()) {
          throw new Error('Please provide your full name');
        }
        await register(formData);
        showToast('Registration successful! Welcome aboard.', 'success');
      } else {
        await login(formData.username, formData.password);
        showToast('Login successful! Welcome back.', 'success');
      }
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.message || 'Authentication failed. Please check your credentials.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-background-decoration">
        <div className="auth-glow orb-1"></div>
        <div className="auth-glow orb-2"></div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <GraduationCap size={32} />
          </div>
          <h1 className="auth-title">Student Management</h1>
          <p className="auth-subtitle">
            {isRegister
              ? 'Create a new account to manage students'
              : 'Enter your credentials to access the portal'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Fill helper button */}
        {!isRegister && (
          <button
            type="button"
            className="demo-fill-btn"
            onClick={handleQuickFill}
            title="Auto-fill default admin credentials"
          >
            <Sparkles size={16} />
            <span>⚡ Quick Demo Fill (admin / admin123)</span>
          </button>
        )}

        {/* Error Alert */}
        {error && (
          <div className="auth-error-banner">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="e.g. Professor Sarah Connor"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="form-group">
              <label htmlFor="role">Role Permission</label>
              <div className="input-with-icon">
                <ShieldCheck size={18} className="input-icon" />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="ROLE_ADMIN">Administrator (Full Access)</option>
                  <option value="ROLE_STAFF">Staff / Faculty</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-small"></span>
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => setIsRegister(false)}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => setIsRegister(true)}
                >
                  Create one now
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
