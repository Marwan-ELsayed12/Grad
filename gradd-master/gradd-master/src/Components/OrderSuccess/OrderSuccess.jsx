import React from 'react';

import './OrderSuccess.css'; // تصميم CSS خارجي بسيط
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const trackingNumber = location.state?.trackingNumber;

  return (
    <div className="order-success-container">
      <div className="order-success-box">
        <h1>🎉 Order Placed Successfully!</h1>
        <p>Thank you for your purchase. Your books will arrive soon 📚✨</p>

        {trackingNumber ? (
        <p className="tracking-number">
          Your tracking number is: <strong>{trackingNumber}</strong>
        </p>
      ) : (
        <p className="tracking-number missing">Tracking number not available.</p>
      )}

        <Link to="/">
          <button className="continue-shopping-button">Continue Shopping 🛍️</button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
