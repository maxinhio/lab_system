import axios from 'axios'

const API = axios.create({ baseURL: '/' });

API.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export async function login(username, password) {
  const res = await API.post('/api/auth/login', { username, password });
  if (res.data && res.data.data && res.data.data.token) {
    localStorage.setItem('token', res.data.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.data.user));
  }
  return res.data;
}

export function logout(){ localStorage.removeItem('token'); localStorage.removeItem('user'); }
export function getUser(){ const u=localStorage.getItem('user'); return u?JSON.parse(u):null }
export default API;
