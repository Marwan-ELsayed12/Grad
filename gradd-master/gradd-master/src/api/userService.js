import api from './config';

export const userService = {
    // Get user profile
    getProfile: async () => {
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update user profile
    updateProfile: async (userData) => {
        try {
            const response = await api.patch('/users/profile', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Change password
    changePassword: async (passwordData) => {
        try {
            const response = await api.post('/users/change-password', passwordData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get user orders
    getUserOrders: async () => {
        try {
            const response = await api.get('/users/orders');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get user wishlist
    getWishlist: async () => {
        try {
            const response = await api.get('/users/wishlist');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 