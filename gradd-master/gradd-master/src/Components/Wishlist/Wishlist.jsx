import React from 'react';
import './Wishlist.css';
import { useBookContext } from '../../context/BookContext';
import { orderService } from '../../services/orderService';

const LoadingIndicator = () => (
  <div style={{
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#f99b10'
  }}>
    ⏳ Loading...
  </div>
);

const Wishlist = () => {
    const {
        wishlist,
        loading,
        error,
        removeFromWishlist,
        addToCart
    } = useBookContext();

    const handleBorrow = async (item) => {
        try {
            await orderService.borrowBook(item.id);
            alert('Book borrowed successfully!');
        } catch (err) {
            console.error('Borrow error:', err);
            alert('Failed to borrow book. Please try again.');
        }
    };

    const handleReturn = async (item) => {
        try {
            await orderService.returnBook(item.id);
            removeFromWishlist(item.id);
            alert('Book returned successfully!');
        } catch (err) {
            console.error('Return error:', err);
            alert('Failed to return book. Please try again.');
        }
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <div className="wishlist-container">
            <h2>My Books</h2>
            {error && <div className="error-message">{error}</div>}
            {wishlist.length === 0 ? (
                <div className="empty-wishlist">
                    <p>Your wishlist is empty</p>
                    <button onClick={() => window.history.back()} className="continue-browsing">
                        Continue Browsing
                    </button>
                </div>
            ) : (
                <div className="wishlist-items">
                    {wishlist.map(item => (
                        <div key={item.id} className="wishlist-item">
                            <img src={item.image} alt={item.title} />
                            <div className="item-details">
                                <h3>{item.title}</h3>
                                <p className="item-price">${item.price}</p>
                                <div className="item-actions">
                                    {!item.borrowed ? (
                                        <>
                                            <button 
                                                onClick={() => addToCart(item)}
                                                className="move-to-cart"
                                            >
                                                Add to Cart
                                            </button>
                                            <button 
                                                onClick={() => handleBorrow(item)}
                                                className="borrow-button"
                                            >
                                                Borrow Book
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => handleReturn(item)}
                                            className="return-button"
                                        >
                                            Return Book
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="remove-button"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;