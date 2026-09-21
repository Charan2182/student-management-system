import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { studentService } from '../services/studentService';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function StudentForm({ showToast }) {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    phone: '',
    dateOfBirth: '',
    enrollmentDate: '',
    status: 'ACTIVE',
    gpa: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const loadStudent = async () => {
        try {
          const data = await studentService.getById(id);
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            department: data.department || '',
            phone: data.phone || '',
            dateOfBirth: data.dateOfBirth || '',
            enrollmentDate: data.enrollmentDate || '',
            status: data.status || 'ACTIVE',
            gpa: data.gpa !== null && data.gpa !== undefined ? data.gpa.toString() : '',
          });
        } catch (err) {
          showToast(err.message || 'Failed to load student record', 'error');
          navigate('/');
        } finally {
          setLoadingInitial(false);
        }
      };
      loadStudent();
    }
  }, [id, isEditMode, navigate, showToast]);

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (formData.phone && !/^[+0-9- ]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number format is invalid (7-20 digits)';
    }

    if (formData.gpa) {
      const gpaNum = parseFloat(formData.gpa);
      if (isNaN(gpaNum) || gpaNum < 1.0 || gpaNum > 10.0) {
        newErrors.gpa = 'GPA must be a number between 1.00 and 10.00';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        department: formData.department.trim(),
        phone: formData.phone.trim() || null,
        dateOfBirth: formData.dateOfBirth || null,
        enrollmentDate: formData.enrollmentDate || null,
        status: formData.status,
        gpa: formData.gpa !== '' ? parseFloat(formData.gpa) : null,
      };

      if (isEditMode) {
        await studentService.update(id, payload);
        showToast(`Student record updated successfully`, 'success');
      } else {
        await studentService.create(payload);
        showToast(`Student registered successfully`, 'success');
      }
      navigate('/');
    } catch (err) {
      if (err.validationErrors) {
        setErrors(err.validationErrors);
      } else if (err.status === 409) {
        setErrors(prev => ({ ...prev, email: err.message }));
      }
      showToast(err.message || 'Error processing student record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
        <p>Loading student details...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <Link to="/" className="btn btn-secondary" style={{ marginBottom: '0.75rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Directory</span>
          </Link>
          <h1 className="page-title">{isEditMode ? 'Edit Student Record' : 'Register New Student'}</h1>
          <p className="page-subtitle">
            {isEditMode
              ? `Updating academic and contact details for student #${id}`
              : 'Complete the form below to enroll a new student into the system'}
          </p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* First Name */}
            <div className="form-group">
              <label className="form-label">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                placeholder="e.g. John"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <span className="invalid-feedback">{errors.firstName}</span>}
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label className="form-label">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                placeholder="e.g. Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <span className="invalid-feedback">{errors.lastName}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="e.g. john.doe@university.edu"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="invalid-feedback">{errors.email}</span>}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label">
                Department / Major <span className="required">*</span>
              </label>
              <input
                type="text"
                name="department"
                className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                placeholder="e.g. Computer Science, Mechanical Eng."
                value={formData.department}
                onChange={handleChange}
              />
              {errors.department && <span className="invalid-feedback">{errors.department}</span>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                name="phone"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="e.g. +1 555-0199"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="invalid-feedback">{errors.phone}</span>}
            </div>

            {/* GPA */}
            <div className="form-group">
              <label className="form-label">GPA (1.00 - 10.00)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                max="10"
                name="gpa"
                className={`form-control ${errors.gpa ? 'is-invalid' : ''}`}
                placeholder="e.g. 8.50"
                value={formData.gpa}
                onChange={handleChange}
              />
              {errors.gpa && <span className="invalid-feedback">{errors.gpa}</span>}
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                className="form-control"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            {/* Enrollment Date */}
            <div className="form-group">
              <label className="form-label">Enrollment Date</label>
              <input
                type="date"
                name="enrollmentDate"
                className="form-control"
                value={formData.enrollmentDate}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div className="form-group full-width">
              <label className="form-label">Academic Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="GRADUATED">GRADUATED</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="spinning" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isEditMode ? 'Update Student' : 'Save Student'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
