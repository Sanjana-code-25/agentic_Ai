import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 Unauthorized, remove invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
};

// Complaint Endpoints
export const complaintService = {
  getMyComplaints: (params) => api.get('/complaints/my-complaints', { params }),
  getComplaintById: (id) => api.get(`/complaints/${id}`),
  createComplaint: (formData) =>
    api.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  classifyImage: (formData) =>
    api.post('/complaints/classify-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  submitFeedback: (id, feedbackData) =>
    api.post(`/complaints/${id}/feedback`, feedbackData),
};

// Admin Endpoints
export const adminService = {
  getAllComplaints: (params) => api.get('/admin/complaints', { params }),
  updateComplaint: (id, updateData) =>
    api.put(`/admin/complaints/${id}`, updateData),
  getStats: () => api.get('/admin/stats'),
};

export default api;
