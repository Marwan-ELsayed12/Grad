import axiosInstance from './config';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await axiosInstance.post('/users/login/', { email, password });
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }
            return response;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    },

    register: async (userData) => {
        try {
            const response = await axiosInstance.post('/users/', userData);
            return response;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        try {
            const response = await axiosInstance.get('/users/me/');
            return response;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to get user profile';
        }
    },

    changePassword: async (userId, passwordData) => {
        try {
            const response = await axiosInstance.post(`/users/${userId}/change_password/`, passwordData);
            return response;
        } catch (error) {
            throw error.response?.data?.message || 'Password change failed';
        }
    },

    // Helper function to check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Helper function to get current user data from localStorage
    getStoredUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};