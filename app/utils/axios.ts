import axios from 'axios';

// Base URL setup
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/users',
  headers: { 'Content-Type': 'application/json' },
});

// User Registration 
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

// User Login
export const loginUser = async ( email: string, password: string ) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};