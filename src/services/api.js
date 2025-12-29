const API_URL = 'https://optimistic-caring-production.up.railway.app/api';

// Helper para hacer fetch con token
const fetchWithAuth = (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  }).then((res) => res.json());
};

// Auth
export const register = (user) =>
  fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  }).then((res) => res.json());

export const login = (email, password) =>
  fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then((res) => res.json());

// Services
export const getServices = () => fetchWithAuth('/services');

// Requests
export const createRequest = (data) => fetchWithAuth('/requests', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const getPendingRequests = () => fetchWithAuth('/requests/pending');

export const acceptRequest = (id) => fetchWithAuth(`/requests/${id}/accept`, {
  method: 'PUT',
});

// Chat
export const sendMessage = (requestId, message) =>
  fetchWithAuth(`/chat/${requestId}`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });

export const getMessages = (requestId) => fetchWithAuth(`/chat/${requestId}`);

// Upload
export const uploadEvidence = (formData) =>
  fetch(`${API_URL}/upload/evidence`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => res.json());