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
    const token = response.data.token;

    // store token in local storage
    localStorage.setItem('token', token);

    return { token };


  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Fetch Profile Data
export const fetchProfile = async (token: string) => {
  try {
    const response = await api.get('/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Update Profile Data
export const updateProfile = async (name: string, email: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put('/profile', { name, email }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
<<<<<<< HEAD
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

// fetch user based on role
export const fetchUsersByRole = async (role: string, currentUserId: string) => {
  const url = '/profiles'
  
  try {
    const response = await api.get(`${url}?role=${role}&exclude=${currentUserId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}
=======
};
>>>>>>> parent of ddaf4aa (Retrieve chats)
