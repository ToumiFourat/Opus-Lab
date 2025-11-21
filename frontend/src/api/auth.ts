// src/api/auth.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function login(email: string, password: string) {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
}

export async function logout() {
  await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
}

export async function refreshToken() {
  const response = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
  return response.data;
}

export async function requestPasswordReset(email: string) {
  const response = await axios.post(`${API_URL}/auth/reset-password`, { email });
  return response.data;
}

export async function confirmPasswordReset(emailOrToken: string, password: string) {
  const isEmail = emailOrToken.includes('@');
  const body = isEmail
    ? { email: emailOrToken, password }
    : { token: emailOrToken, password };
  const response = await axios.post(`${API_URL}/auth/reset-password/confirm`, body);
  return response.data;
}

export async function fetchMe() {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get(`${API_URL}/me`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}
