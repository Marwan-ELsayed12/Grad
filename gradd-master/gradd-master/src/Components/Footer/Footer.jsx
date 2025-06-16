import React from 'react';
import { FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './Footer.css';
import logo from '../Images/IQRAA__1_-removebg-preview.png';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="nav-logo0">
          <img src={logo} alt="Logo" />
        </div>
        
        <div className="contact">
          <h3>CONTACT</h3>
          <ul>
            <li>+123 456 789</li>
            <li>info@iqraa.com</li>
            <li>123 Sidi Gaber, Alexandria</li>
          </ul>
        </div>
      
        <div className="social-media">
  <a href="https://www.facebook.com/share/1Mk2ZsZmes/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
    <FaFacebook size={24} />
  </a>
  <a href="https://www.linkedin.com/in/iqraa-1p-b06a9b338/" target="_blank" rel="noopener noreferrer">
    <FaLinkedin size={24} />
  </a>
  <a href="https://www.instagram.com/iqraa1p" target="_blank" rel="noopener noreferrer">
    <FaInstagram size={24} />
  </a>
</div>

      </div>
    </footer>
  );
};

export default Footer;


