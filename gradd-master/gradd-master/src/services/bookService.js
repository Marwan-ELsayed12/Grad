import axiosInstance from './config';

export const bookService = {
    getAllBooks: () => axiosInstance.get('/books/'),

    getBookById: (id) => axiosInstance.get(`/books/${id}/`),

    getBooksByGenre: (genre) => axiosInstance.get('/books/genres/', { params: { genre } }),

    getRecommendations: () => axiosInstance.get('/recommendations/'),

    getTopRatedBooks: () => axiosInstance.get('/recommendations/top_rated_books/'),
    
    // Reviews related methods
    getBookReviews: (bookId) => axiosInstance.get(`/reviews/?book=${bookId}`),

    addReview: async (bookId, reviewData) => {
        try {
            const response = await axiosInstance.post('/reviews/', {
                book: bookId,
                ...reviewData
            });
            return response;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to add review';
        }
    },

    updateReview: async (reviewId, reviewData) => {
        try {
            const response = await axiosInstance.put(`/reviews/${reviewId}/`, reviewData);
            return response;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to update review';
        }
    },

    deleteReview: async (reviewId) => {
        try {
            await axiosInstance.delete(`/reviews/${reviewId}/`);
        } catch (error) {
            throw error.response?.data?.message || 'Failed to delete review';
        }
    },

    // Book search and filtering
    searchBooks: (query) => axiosInstance.get('/books/search/', { params: { query } }),

    getBooksByCategory: (category) => axiosInstance.get('/books/', { params: { category } }),

    getBooksByAuthor: (author) => axiosInstance.get('/books/', { params: { author } }),

    // Error handling helper
    handleApiError: (error) => {
        if (error.response) {
            throw new Error(error.response.data.message || 'Server error occurred');
        } else if (error.request) {
            throw new Error('No response from server. Please check your connection.');
        } else {
            throw new Error('Error making request. Please try again.');
        }
    }
};