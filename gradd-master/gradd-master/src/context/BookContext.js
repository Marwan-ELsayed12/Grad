import React, { createContext, useContext, useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';

const BookContext = createContext();

export const useBookContext = () => useContext(BookContext);

export const BookProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize cart and wishlist from both localStorage and backend
    useEffect(() => {
        const initializeData = async () => {
            try {
                // Load local data
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

                // Load backend data
                const [purchasedBooks, borrowedBooks] = await Promise.all([
                    orderService.getPurchasedBooks(),
                    orderService.getBorrowedBooks()
                ]);

                // Merge local and backend data
                const mergedCart = mergeCarts(localCart, purchasedBooks);
                const mergedWishlist = mergeWishlists(localWishlist, borrowedBooks);

                setCart(mergedCart);
                setWishlist(mergedWishlist);
            } catch (err) {
                setError('Failed to initialize data');
                console.error('Initialization error:', err);
                toast.error('Failed to load your books. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    // Sync cart changes to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Sync wishlist changes to localStorage
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const mergeCarts = (localCart, purchasedBooks) => {
        const mergedItems = [...localCart];
        purchasedBooks.forEach(book => {
            if (!mergedItems.find(item => item.id === book.id)) {
                mergedItems.push({
                    id: book.id,
                    title: book.title,
                    image: book.image,
                    price: book.price,
                    quantity: 1
                });
            }
        });
        return mergedItems;
    };

    const mergeWishlists = (localWishlist, borrowedBooks) => {
        const mergedItems = [...localWishlist];
        borrowedBooks.forEach(book => {
            if (!mergedItems.find(item => item.id === book.id)) {
                mergedItems.push({
                    id: book.id,
                    title: book.title,
                    image: book.image,
                    price: book.price,
                    borrowed: true
                });
            }
        });
        return mergedItems;
    };

    const addToCart = async (item) => {
        try {
            const existingItem = cart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                setCart(cart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                ));
                toast.success('Item quantity updated in cart');
            } else {
                setCart([...cart, { ...item, quantity: 1 }]);
                toast.success('Item added to cart');
            }
        } catch (err) {
            setError('Failed to add item to cart');
            toast.error('Failed to add item to cart. Please try again.');
            throw err;
        }
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
        toast.info('Item removed from cart');
    };

    const addToWishlist = async (item) => {
        if (!wishlist.find(wishItem => wishItem.id === item.id)) {
            setWishlist([...wishlist, item]);
            toast.success('Item added to My Books');
        } else {
            toast.info('Item already in My Books');
        }
    };

    const removeFromWishlist = (itemId) => {
        setWishlist(wishlist.filter(item => item.id !== itemId));
        toast.info('Item removed from My Books');
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
        toast.info('Cart cleared');
    };

    const updateCartItemQuantity = (itemId, quantity) => {
        if (quantity < 1) return;
        setCart(cart.map(item =>
            item.id === itemId ? { ...item, quantity } : item
        ));
        toast.success('Cart quantity updated');
    };

    return (
        <BookContext.Provider value={{
            cart,
            wishlist,
            loading,
            error,
            addToCart,
            removeFromCart,
            addToWishlist,
            removeFromWishlist,
            clearCart,
            updateCartItemQuantity
        }}>
            {children}
        </BookContext.Provider>
    );
};