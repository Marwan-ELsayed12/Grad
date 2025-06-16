import React from 'react';
import './Cart.css';
import { useBookContext } from '../../context/BookContext';
import { orderService } from '../../services/orderService';


const Cart = () => {
    const {
        cart,
        loading,
        error,
        removeFromCart,
        clearCart,
        updateCartItemQuantity
    } = useBookContext();

    const handleCheckout = async () => {
        try {
            // Create orders for each item in cart
            const purchasePromises = cart.map(item => 
                orderService.purchaseBook(item.id)
            );
            
            await Promise.all(purchasePromises);
            clearCart();
            alert('Purchase successful! Thank you for your order.');
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Failed to process purchase. Please try again.');
        }
    };

  if (loading) {
    return <div>Loading...</div>;
}


    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            {error && <div className="error-message">{error}</div>}
            {cart.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                    <button onClick={() => window.history.back()} className="continue-shopping">
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.title} />
                                <div className="item-details">
                                    <h3>{item.title}</h3>
                                    <p className="item-price">${item.price}</p>
                                    <div className="quantity-controls">
                                        <button 
                                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button 
                                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.id)} 
                                        className="remove-button"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <div className="summary-details">
                            <p>Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                            <p>Total Price: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</p>
                        </div>
                        <div className="cart-actions">
                            <button onClick={clearCart} className="clear-cart">
                                Clear Cart
                            </button>
                            <button onClick={handleCheckout} className="checkout-button">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;