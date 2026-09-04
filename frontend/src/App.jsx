import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';
import StudentDetails from './pages/StudentDetails';

export default function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<StudentList showToast={showToast} />} />
            <Route path="/students/new" element={<StudentForm showToast={showToast} />} />
            <Route path="/students/edit/:id" element={<StudentForm showToast={showToast} />} />
            <Route path="/students/:id" element={<StudentDetails showToast={showToast} />} />
          </Routes>
        </main>
        <Toast toast={toast} onClose={closeToast} />
      </div>
    </Router>
  );
}
