import api from './config';
import { userService } from './userService';
import { dataService } from './dataService';

export const orderService = {
    // Assuming purchased books are fetched via userService.getUserOrders
    getPurchasedBooks: async () => {
        try {
            const response = await userService.getUserOrders();
            // Assuming the response from getUserOrders is an array of books
            return response;
        } catch (error) {
            console.error('Error fetching purchased books:', error);
            throw error.response?.data || error.message;
        }
    },

    // Assuming borrowed books are fetched via userService.getWishlist or dataService.getBorrowedBooks (if it exists)
    // For now, mapping to wishlist as a common pattern for 'my books'/'borrowed' concepts
    getBorrowedBooks: async () => {
        try {
            const response = await userService.getWishlist();
            // Assuming the response from getWishlist is an array of books
            return response;
        } catch (error) {
            console.error('Error fetching borrowed books:', error);
            throw error.response?.data || error.message;
        }
    },

    // Add more order-related functions here if needed, e.g., createOrder, cancelOrder
    createOrder: async (orderData) => {
        try {
            const response = await dataService.createOrder(orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error.response?.data || error.message;
        }
    }
}; 