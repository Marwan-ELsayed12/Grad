import React, { useState } from 'react';
import axios from 'axios';
import '../Shipping/PageStyles.css';

const TrackOrder = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      setOrderStatus(null);
      return;
    }
    setLoading(true);
    setError(null);
    setOrderStatus(null);

    try {
      const response = await axios.get(
        `http://localhost:8000/orders/track/?tracking_number=${trackingNumber}`
      );
      setOrderStatus(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Order not found");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="main-title">Track Your Order</h1>

      <div className="track-order-container" style={{ marginTop: '40px' }}>
        <input
          type="text"
          className="track-input"
          placeholder="Enter your tracking number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <button
          className="track-button"
          onClick={handleTrack}
          disabled={loading}
        >
          {loading ? 'Tracking...' : 'Track Order'}
        </button>

        {error && <p className="track-error-message">{error}</p>}

        {orderStatus && (
          <div className="order-status order-details" style={{ marginTop: '20px' }}>
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {orderStatus.id}</p>
            <p><strong>Status:</strong> {orderStatus.status}</p>
            <p><strong>Estimated Delivery:</strong> {orderStatus.estimated_delivery}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
