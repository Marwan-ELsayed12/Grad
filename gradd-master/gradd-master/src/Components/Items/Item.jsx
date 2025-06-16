import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';
import { useBookContext } from '../../context/BookContext';
import './Item.css';

const Item = (props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, addToWishlist } = useBookContext();

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      addToCart({
        id: props.id,
        title: props.title,
        image: props.image,
        price: props.new_price,
        quantity: 1
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleAddToWishlist = () => {
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      addToWishlist({
        id: props.id,
        title: props.title,
        image: props.image,
        price: props.new_price
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add item to wishlist. Please try again.');
    }
  };

  return (
    <div className="item">
      <Link to={`/book/${props.id}`} className="image-frame">
        <img src={props.image} alt="Book Cover" />
      </Link>

      <p className="item-title">{props.title}</p> 
      <p className="item-price">${props.new_price}</p>

      <div className="item-buttons">
        <button onClick={handleAddToCart} className="item-button">
          Add to Cart
        </button>
        <button onClick={handleAddToWishlist} className="item-button">
          Add to My Books
        </button>
      </div>
    </div>
  );
};

export default Item;




