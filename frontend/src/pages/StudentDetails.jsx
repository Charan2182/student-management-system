import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { studentService } from '../services/studentService';
import Modal from '../components/Modal';
import { ArrowLeft, Edit2, Trash2, Mail, Phone, Calendar, BookOpen, Award, CheckCircle } from 'lucide-react';

export default function StudentDetails({ showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const data = await studentService.getById(id);
        setStudent(data);
      } catch (err) {
        showToast(err.message || 'Failed to fetch student details', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id, navigate, showToast]);

  const handleDelete = async () => {
    try {
      await studentService.delete(id);
      showToast('Student deleted successfully', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Failed to delete student', 'error');
    } finally {
      setDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
        <p>Loading student profile...</p>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/students/edit/${student.id}`} className="btn btn-secondary">
            <Edit2 size={16} />
            <span>Edit Record</span>
          </Link>
          <button className="btn btn-danger" onClick={() => setDeleteModal(true)}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="form-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.75rem', marginBottom: '1.75rem' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            {student.firstName[0]}{student.lastName[0]}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a' }}>
                {student.firstName} {student.lastName}
              </h2>
              <span className={`badge ${student.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}`}>
                {student.status || 'ACTIVE'}
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Student ID: #{student.id}
            </p>
          </div>
        </div>

        <div className="form-grid" style={{ rowGap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon blue" style={{ width: '40px', height: '40px' }}>
              <Mail size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Email Address</div>
              <div style={{ fontWeight: '600', color: '#0f172a' }}>{student.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon purple" style={{ width: '40px', height: '40px' }}>
              <BookOpen size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Department / Major</div>
              <div style={{ fontWeight: '600', color: '#0f172a' }}>{student.department}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon green" style={{ width: '40px', height: '40px' }}>
              <Phone size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Phone Number</div>
              <div style={{ fontWeight: '600', color: '#0f172a' }}>{student.phone || 'Not provided'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon amber" style={{ width: '40px', height: '40px' }}>
              <Award size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Cumulative GPA</div>
              <div style={{ fontWeight: '600', color: '#0f172a' }}>
                {student.gpa !== null && student.gpa !== undefined ? student.gpa.toFixed(2) : 'N/A'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon blue" style={{ width: '40px', height: '40px' }}>
              <Calendar size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Date of Birth</div>
              <div style={{ fontWeight: '600', color: '#0f172a' }}>{student.dateOfBirth || 'Not specified'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon green" style={{ width: '40px', height: '40px' }}>
              <CheckCircle size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Enrollment Date</div>
              <div style={{ fontWeight: '600', color: '#0f172a' }}>{student.enrollmentDate || 'Not specified'}</div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModal}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${student.firstName} ${student.lastName}? This action cannot be undone.`}
        confirmText="Delete Student"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
      />
    </div>
  );
}
