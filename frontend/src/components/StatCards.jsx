import React from 'react';
import { Users, UserCheck, Building2, Award } from 'lucide-react';

export default function StatCards({ students = [] }) {
  const total = students.length;
  const active = students.filter(s => s.status === 'ACTIVE').length;
  const departments = new Set(students.map(s => s.department)).size;
  
  const validGpas = students.filter(s => s.gpa !== null && s.gpa !== undefined);
  const avgGpa = validGpas.length > 0 
    ? (validGpas.reduce((sum, s) => sum + s.gpa, 0) / validGpas.length).toFixed(2)
    : 'N/A';

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon blue">
          <Users size={24} />
        </div>
        <div>
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Students</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon green">
          <UserCheck size={24} />
        </div>
        <div>
          <div className="stat-value">{active}</div>
          <div className="stat-label">Active Enrollments</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon purple">
          <Building2 size={24} />
        </div>
        <div>
          <div className="stat-value">{departments}</div>
          <div className="stat-label">Departments</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon amber">
          <Award size={24} />
        </div>
        <div>
          <div className="stat-value">{avgGpa}</div>
          <div className="stat-label">Average GPA</div>
        </div>
      </div>
    </div>
  );
}
