import api from './config';

export const authService = {
    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Register user
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            const response = await api.get('/users/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 