import axios from 'axios';
import { ChatData } from './types';

// Node.js API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:5000/api/users',
  headers: { 'Content-Type': 'application/json' },
});

// Django API instance (through Node.js as a reverse proxy)
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/users', // Node.js service URL, which proxies to Django for certain routes
});

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('token');

// Interceptor for `api` (Node.js API calls)
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for `axiosInstance` (Django API calls through Node.js proxy)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { api, axiosInstance };

// register new user
export const registerUser = async (
  name: string, 
  email: string, 
  password: string, 
  role = 'tenant'
) => {
  try {
    const response = await api.post('/register', { name, email, password, role, profilePicture: '' });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// user login
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/login', { email, password });
    const token = response.data.token;
    const expirationTime = Date.now() + 55 * 60 * 1000;
    localStorage.setItem('token', token);
    localStorage.setItem('token_expiration', expirationTime.toString());
    return { token };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// fetch user profile
export const fetchProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// fetch user by ID
export const fetchUserById = async (userId: string) => {
  try {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
  }
};

// update user profile
export const updateProfile = async (name: string, email: string) => {
  try {
    const response = await api.put('/profile', { name, email });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// create a chat
export const createChat = async (participants: string[]) => {
  const chatData: ChatData = { participants };

  try {
    const response = await axiosInstance.post('/create-chat', chatData);
    return response.data;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

// fetch user chats
export const getUserChats = async () => {
  try {
    const response = await axiosInstance.get('/get-chats');
    console.log('Fetched chat data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};
