import api from './api';

const STUDENT_API_BASE = '/students';

export const studentService = {
  // Fetch all students with optional search and department filters
  async getAll(search = '', department = '') {
    const params = {};
    if (search && search.trim()) {
      params.search = search.trim();
    }
    if (department && department.trim() && department !== 'ALL') {
      params.department = department.trim();
    }
    const response = await api.get(STUDENT_API_BASE, { params });
    return response.data.data;
  },

  // Fetch a single student by ID
  async getById(id) {
    const response = await api.get(`${STUDENT_API_BASE}/${id}`);
    return response.data.data;
  },

  // Create a new student
  async create(studentData) {
    const response = await api.post(STUDENT_API_BASE, studentData);
    return response.data.data;
  },

  // Update an existing student
  async update(id, studentData) {
    const response = await api.put(`${STUDENT_API_BASE}/${id}`, studentData);
    return response.data.data;
  },

  // Delete a student by ID
  async delete(id) {
    const response = await api.delete(`${STUDENT_API_BASE}/${id}`);
    return response.data.data;
  },
};
