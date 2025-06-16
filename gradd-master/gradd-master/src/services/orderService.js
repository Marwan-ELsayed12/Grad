import axiosInstance from './config';

export const orderService = {
    // Get all orders
    getAllOrders: () => axiosInstance.get('/orders/'),

    // Get borrowed books
    getBorrowedBooks: () => axiosInstance.get('/orders/borrowed'),

    // Get purchased books
    getPurchasedBooks: () => axiosInstance.get('/orders/purchased'),

    // Purchase a book
    purchaseBook: (bookId) => axiosInstance.post('/orders/', {
        book_id: bookId,
        type: 'purchase'
    }),

    // Borrow a book
    borrowBook: (bookId, borrowDate, returnDate) => axiosInstance.post('/orders/', {
        book_id: bookId,
        type: 'borrow',
        borrow_date: borrowDate,
        return_date: returnDate
    }),

    // Return a book
    returnBook: (orderId) => axiosInstance.post(`/orders/${orderId}/return`),

    // Cancel an order
    cancelOrder: (orderId) => axiosInstance.post(`/orders/${orderId}/cancel`),

    // Get order statistics
    getOrderStats: () => axiosInstance.get('/orders/stats/orders'),

    // Get transaction statistics
    getTransactionStats: () => axiosInstance.get('/orders/stats/transactions')
}; 