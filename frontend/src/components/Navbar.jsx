import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Users, UserPlus, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ showToast }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (showToast) {
      showToast('Logged out successfully', 'info');
    }
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <GraduationCap size={24} />
          </div>
          <span className="brand-title">Student Management System</span>
        </Link>

        {isAuthenticated ? (
          <div className="nav-actions">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Directory</span>
            </Link>
            <Link
              to="/students/new"
              className={`btn btn-primary ${location.pathname === '/students/new' ? 'active' : ''}`}
            >
              <UserPlus size={18} />
              <span>Add Student</span>
            </Link>

            <div className="user-profile-badge">
              <div className="user-avatar">
                {user?.fullName?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.fullName || user?.username}</span>
                <span className="user-role">
                  <Shield size={10} />
                  {user?.role?.replace('ROLE_', '') || 'USER'}
                </span>
              </div>
              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
                title="Sign out of system"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="nav-actions">
            <Link to="/login" className="btn btn-primary">
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
