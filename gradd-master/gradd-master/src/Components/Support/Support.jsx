import React, { useState } from 'react';
import axios from 'axios';
import '../Support/Support.css';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    // !!!!!!!!!!  Replace this URL with your actual backend API endpoint !!!!!!!
      const response = await axios.post('https://your-backend.com/api/support/', formData);

      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting support form:', error);
      alert('❌ An error occurred while sending your message. Please try again later.');
    }
  };

  return (
    <div className="page-container">
      <h1 className="main-title">24/7 Support</h1>
      <p className="card-description">Call us anytime or send us a message below.</p>

      <ul className="contact-list">
        <li>📧 Email: support@iqraa.com</li>
        <li>📞 Phone: +123 456 7890</li>
      </ul>

      <div className="card support-form">
        <h2 className="card-title">📝 Send us your issue</h2>
        {submitted && <p className="success-message">✅ Your message has been sent. We’ll get back to you soon.</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Type your message here..."
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">📨 Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Support;
