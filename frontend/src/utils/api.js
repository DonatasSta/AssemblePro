import axios from 'axios';
import { getToken, logout } from './auth';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Log configuration
console.log('API Service configured with baseURL:', process.env.REACT_APP_API_URL || '/api');

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Auto logout if 401 response returned from api
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Api methods for each endpoint
const apiService = {
  // Auth
  login: credentials => {
    console.log('Login API call with:', { ...credentials, password: '****' });
    return api.post('/token/', credentials);
  },
  register: userData => api.post('/register/', userData),
  refreshToken: refreshToken => api.post('/token/refresh/', { refresh: refreshToken }),
  
  // User profile
  getProfile: () => {
    console.log('Getting profile, token exists:', !!getToken());
    return api.get('/profiles/me/');
  },
  updateProfile: profileData => api.put('/profiles/update_me/', profileData),
  
  // Services
  getServices: params => api.get('/services/', { params }),
  getService: id => api.get(`/services/${id}/`),
  createService: serviceData => api.post('/services/', serviceData),
  updateService: (id, serviceData) => api.put(`/services/${id}/`, serviceData),
  deleteService: id => api.delete(`/services/${id}/`),
  getUserServices: () => api.get('/services/my_services/'),
  
  // Projects
  getProjects: params => api.get('/projects/', { params }),
  getProject: id => api.get(`/projects/${id}/`),
  createProject: projectData => api.post('/projects/', projectData),
  updateProject: (id, projectData) => api.put(`/projects/${id}/`, projectData),
  deleteProject: id => api.delete(`/projects/${id}/`),
  getUserProjects: () => api.get('/projects/my_projects/'),
  getAssignedProjects: () => api.get('/projects/assigned_to_me/'),
  assignProject: (id, userId) => api.patch(`/projects/${id}/assign/`, { assigned_to: userId }),
  updateProjectStatus: (id, status) => api.patch(`/projects/${id}/update_status/`, { status }),
  
  // Messages
  getConversations: () => api.get('/messages/conversations/'),
  getMessages: userId => api.get('/messages/with_user/', { params: { user_id: userId } }),
  sendMessage: messageData => api.post('/messages/', messageData),
  
  // Reviews
  getUserReviews: userId => api.get('/reviews/for_user/', { params: { user_id: userId } }),
  createReview: reviewData => api.post('/reviews/', reviewData)
};

export default apiService;
