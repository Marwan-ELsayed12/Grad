import axiosInstance from './config';

export const reviewService = {
    getAllReviews: () => axiosInstance.get('/reviews/'),

    getReviewById: (id) => axiosInstance.get(`/reviews/${id}/`),

    createReview: async (reviewData) => {
        try {
            const response = await axiosInstance.post('/reviews/', reviewData);
            return response;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create review';
        }
    },

    getUserReviews: () => axiosInstance.get('/reviews/my_reviews/'),

    getRecentReviews: () => axiosInstance.get('/reviews/recent/'),

    getTopRatedReviews: () => axiosInstance.get('/reviews/top_rated/'),

    getReviewSentiment: (id) => axiosInstance.get(`/reviews/${id}/sentiment/`),

    getBookSentiments: () => axiosInstance.get('/reviews/book_sentiments/'),

    updateReview: async (id, reviewData) => {
        try {
            const response = await axiosInstance.put(`/reviews/${id}/`, reviewData);
            return response;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to update review';
        }
    },

    deleteReview: async (id) => {
        try {
            await axiosInstance.delete(`/reviews/${id}/`);
        } catch (error) {
            throw error.response?.data?.message || 'Failed to delete review';
        }
    },

    // Get aggregated review data for a book
    getBookReviewStats: async (bookId) => {
        try {
            const [reviews, sentiment] = await Promise.all([
                axiosInstance.get(`/reviews/?book=${bookId}`),
                axiosInstance.get(`/reviews/book_sentiments/?book=${bookId}`)
            ]);

            const totalReviews = reviews.length;
            const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

            return {
                totalReviews,
                averageRating,
                sentiment: sentiment.sentiment,
                reviews
            };
        } catch (error) {
            throw error.response?.data?.message || 'Failed to get review statistics';
        }
    }
};