import api from './config';

export const dataService = {
    // Get all books
    getAllBooks: async () => {
        try {
            const response = await api.get('/books');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get book by ID
    getBookById: async (id) => {
        try {
            const response = await api.get(`/books/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get books by category
    getBooksByCategory: async (category) => {
        try {
            const response = await api.get(`/books/category/${category}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get popular books
    getPopularBooks: async () => {
        try {
            const response = await api.get('/books/popular');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Add to cart
    addToCart: async (bookId, quantity) => {
        try {
            const response = await api.post('/cart', { book_id: bookId, quantity });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get cart
    getCart: async () => {
        try {
            const response = await api.get('/cart');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Add to wishlist
    addToWishlist: async (bookId) => {
        try {
            const response = await api.post('/wishlist', { book_id: bookId });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create order
    createOrder: async (orderData) => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 