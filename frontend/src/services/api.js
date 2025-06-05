import axios from 'axios'

const API_URL = 'http://192.168.0.24:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  validateToken: () => api.get('/auth/me'), // Alias for token validation
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.put('/user/change-password', data),
}

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getUserItems: () => api.get('/user/items'),
}

export const adminAPI = {
  // User management
  getUsers: () => api.get('/admin/users'),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  
  // Question management
  getQuestions: (page = 1, limit = 10) => api.get('/admin/questions', {
    params: { page, limit }
  }),
  createQuestion: (questionData) => api.post('/admin/questions', questionData),
  updateQuestion: (questionId, questionData) => api.put(`/admin/questions/${questionId}`, questionData),
  deleteQuestion: (questionId) => api.delete(`/admin/questions/${questionId}`),
  importQuestions: (formData) => {
    return api.post('/admin/questions/import-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadImage: (formData) => {
    return api.post('/admin/questions/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteAllQuestions: () => api.delete('/admin/questions/all/delete'),
}

export const examAPI = {
  submitExamResult: (submission) => api.post('/exams/submit', submission),
  getExamHistory: () => api.get('/exams/history'),
  getExamStats: () => api.get('/exams/stats'),
  getExamResult: (resultId) => api.get(`/exams/results/${resultId}`),
  createSession: (sessionData) => api.post('/exams/sessions', sessionData),
  completeSession: (sessionId) => api.put(`/exams/sessions/${sessionId}/complete`),
}

export const allquestionAPI = {
  getAll: ({ page = 1, limit = 40 }) =>
    api.get(`/questions`, {
      params: { mode: 'all-questions', page, limit }
    }),

}

export const questionAPI = {
  getTraining: (limit = 40) =>
    api.get(`/questions`, {
      params: { mode: 'training', limit }
    }),
};

export default api
