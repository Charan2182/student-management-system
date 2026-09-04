import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Users, UserPlus } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <GraduationCap size={24} />
          </div>
          <span className="brand-title">Student Management System</span>
        </Link>

        <div className="nav-actions">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>Students Directory</span>
          </Link>
          <Link
            to="/students/new"
            className={`btn btn-primary ${location.pathname === '/students/new' ? 'active' : ''}`}
          >
            <UserPlus size={18} />
            <span>Add Student</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
