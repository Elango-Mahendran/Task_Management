import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
// Create axios instance 
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; fullName: string }) => {
    console.log('Sending registration data:', data);
    return api.post('/auth/register', data);
  },
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () =>
    api.get('/auth/me'),
  
  logout: () =>
    api.post('/auth/logout'),
};

// Tasks API
export const tasksAPI = {
  getTasks: (params?: any) =>
    api.get('/tasks', { params }),
  
  getRoomTasks: (roomId: string, params?: any) =>
    api.get(`/tasks/room/${roomId}`, { params }),
  
  createTask: (data: any) =>
    api.post('/tasks', data),
  
  updateTask: (id: string, data: any) =>
    api.put(`/tasks/${id}`, data),
  
  deleteTask: (id: string) =>
    api.delete(`/tasks/${id}`),
  
  getTaskStats: (params?: any) =>
    api.get('/tasks/stats', { params }),
};

// Rooms API
export const roomsAPI = {
  getRooms: () =>
    api.get('/rooms'),
  
  getRoom: (id: string) =>
    api.get(`/rooms/${id}`),
  
  createRoom: (data: { name: string; description?: string; isPublic?: boolean }) =>
    api.post('/rooms', data),
  
  joinRoom: (inviteCode: string) =>
    api.post('/rooms/join', { inviteCode }),
  
  leaveRoom: (id: string) =>
    api.post(`/rooms/${id}/leave`),
  
  updateRoom: (id: string, data: any) =>
    api.put(`/rooms/${id}`, data),
  
  deleteRoom: (id: string) =>
    api.delete(`/rooms/${id}`),
  
  getRoomStats: (id: string) =>
    api.get(`/rooms/${id}/stats`),
};

// Users API
export const usersAPI = {
  getProfile: () =>
    api.get('/users/profile'),
  
  updateProfile: (data: any) =>
    api.put('/users/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/users/password', data),
  
  getStats: () =>
    api.get('/users/stats'),
  
  searchUsers: (query: string) =>
    api.get('/users/search', { params: { q: query } }),
};

export default api;