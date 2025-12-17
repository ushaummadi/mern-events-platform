import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  auth: {
    signup: (data) => client.post('/auth/signup', data),
    login: (data) => client.post('/auth/login', data),
  },
  events: {
    list: () => client.get('/events'),
    create: (data) => client.post('/events', data),
    get: (id) => client.get(`/events/${id}`),
    update: (id, data) => client.put(`/events/${id}`, data),
    delete: (id) => client.delete(`/events/${id}`),
    rsvp: (id) => client.post(`/events/${id}/rsvp`),
    leave: (id) => client.delete(`/events/${id}/rsvp`),
    uploadImage: (id, file) => {
      const formData = new FormData();
      formData.append('image', file);
      return client.post(`/events/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  },
};
