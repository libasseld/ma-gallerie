import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Configuration de l'instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  transformRequest: [(data, headers) => {
    // Ne pas modifier le Content-Type si c'est un FormData
    if (headers && data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
      return data;
    } else if (headers) {
      headers['Content-Type'] = 'application/json';
      return JSON.stringify(data);
    }
    return data;
  }],
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  register: async (data: { username: string; email: string; password: string }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
  
  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
};


// Albums API
export const albums = {
  getAll: async () => {
    const response = await api.get('/albums');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
  getMyAlbums: async () => {
    const response = await api.get('/albums/my-albums');
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/albums/${id}`);
    return response.data;
  },
  
  create: async (data: { title: string; description: string; isPublic: boolean }) => {
    const response = await api.post('/albums', data);
    return response.data;
  },
    
  update: async (id: string, data: { title?: string; description?: string; isPublic?: boolean }) => {
    const response = await api.put(`/albums/${id}`, data);
    return response.data;
  },
    
  delete: async (id: string) => {
    const response = await api.delete(`/albums/${id}`);
    return response.data;
  },
    
  publish: async (id: string) => {
    const response = await api.post(`/albums/${id}/publish`);
    return response.data;
  },
    
  unpublish: async (id: string) => {
    const response = await api.post(`/albums/${id}/unpublish`);
    return response.data;
  },

  getImages: async (id: string) => {
    const response = await api.get(`/albums/${id}/images`);
    return response.data;
  },
};

// Images API
export const images = {
  getAll: async () => {
    const response = await api.get('/images');
    return response.data;
  },
  
  get: async (id: string) => {
    const response = await api.get(`/images/${id}`);
    return response.data;
  },
  
  create: async (data: FormData) => {
    const response = await api.post('/images', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
    
  update: async (id: string, data: { title?: string; description?: string }) => {
    const response = await api.put(`/images/${id}`, data);
    return response.data;
  },
    
  delete: async (id: string) => {
    const response = await api.delete(`/images/${id}`);
    return response.data;
  },
};

// Stats API
export const stats = {
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
};