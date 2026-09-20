import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';
import StudentDetails from './pages/StudentDetails';
import Login from './pages/Login';

export default function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar showToast={showToast} />
          <main className="main-content">
            <Routes>
              {/* Public Authentication Route */}
              <Route path="/login" element={<Login showToast={showToast} />} />

              {/* Protected Application Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <StudentList showToast={showToast} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/new"
                element={
                  <ProtectedRoute>
                    <StudentForm showToast={showToast} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/edit/:id"
                element={
                  <ProtectedRoute>
                    <StudentForm showToast={showToast} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/:id"
                element={
                  <ProtectedRoute>
                    <StudentDetails showToast={showToast} />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toast toast={toast} onClose={closeToast} />
        </div>
      </Router>
    </AuthProvider>
  );
}
