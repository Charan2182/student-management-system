import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentService } from '../services/studentService';
import StatCards from '../components/StatCards';
import Modal from '../components/Modal';
import { Search, Plus, Eye, Edit2, Trash2, GraduationCap, AlertCircle, RefreshCw } from 'lucide-react';

export default function StudentList({ showToast }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  
  // Modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, studentId: null, studentName: '' });
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Compute unique departments for filter dropdown
  const departmentOptions = useMemo(() => {
    const depts = new Set(students.map(s => s.department).filter(Boolean));
    return Array.from(depts).sort();
  }, [students]);

  // Client-side filtering for fast responsive typing
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch =
        searchTerm === '' ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = selectedDept === 'ALL' || s.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [students, searchTerm, selectedDept]);

  const handleDeleteClick = (student) => {
    setDeleteModal({
      isOpen: true,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await studentService.delete(deleteModal.studentId);
      showToast(`Student ${deleteModal.studentName} deleted successfully`, 'success');
      setStudents(prev => prev.filter(s => s.id !== deleteModal.studentId));
    } catch (err) {
      showToast(err.message || 'Failed to delete student', 'error');
    } finally {
      setDeleteModal({ isOpen: false, studentId: null, studentName: '' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Directory</h1>
          <p className="page-subtitle">Manage, search, and monitor student academic records</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={fetchStudents} title="Refresh data">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <Link to="/students/new" className="btn btn-primary">
            <Plus size={18} />
            <span>Add New Student</span>
          </Link>
        </div>
      </div>

      {/* Metrics Overview */}
      <StatCards students={students} />

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by student name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="select-filter"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="ALL">All Departments</option>
          {departmentOptions.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Main Table Card */}
      <div className="card-table">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={32} className="spinning" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '0.75rem' }}>Loading student directory...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <GraduationCap className="empty-icon" />
            <h3 className="empty-title">No students found</h3>
            <p className="empty-desc">
              {searchTerm || selectedDept !== 'ALL'
                ? 'No student matches your search or filter criteria. Try resetting the filters.'
                : 'Your student directory is currently empty. Get started by registering your first student.'}
            </p>
            {searchTerm || selectedDept !== 'ALL' ? (
              <button
                className="btn btn-secondary"
                onClick={() => { setSearchTerm(''); setSelectedDept('ALL'); }}
              >
                Clear Filters
              </button>
            ) : (
              <Link to="/students/new" className="btn btn-primary">
                <Plus size={18} />
                <span>Register Student</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>GPA</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td style={{ fontWeight: 600, color: '#64748b' }}>#{student.id}</td>
                    <td style={{ fontWeight: 600 }}>
                      <Link
                        to={`/students/${student.id}`}
                        style={{ color: '#0f172a', textDecoration: 'none' }}
                      >
                        {student.firstName} {student.lastName}
                      </Link>
                    </td>
                    <td style={{ color: '#475569' }}>{student.email}</td>
                    <td>
                      <span className="badge badge-dept">{student.department}</span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.88rem' }}>
                      {student.phone || '—'}
                    </td>
                    <td>
                      <span className={`badge ${student.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}`}>
                        {student.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td>
                      {student.gpa !== null && student.gpa !== undefined ? (
                        <span className="badge badge-gpa">{student.gpa.toFixed(2)}</span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="action-btn"
                          title="View Details"
                          onClick={() => navigate(`/students/${student.id}`)}
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          className="action-btn edit"
                          title="Edit Record"
                          onClick={() => navigate(`/students/edit/${student.id}`)}
                        >
                          <Edit2 size={17} />
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete Student"
                          onClick={() => handleDeleteClick(student)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete student "${deleteModal.studentName}"? This action permanently removes the record from the database.`}
        confirmText="Delete Student"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, studentId: null, studentName: '' })}
      />
    </div>
  );
}
