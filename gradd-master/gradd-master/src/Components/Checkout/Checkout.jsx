import React, { useState } from 'react';
import { useBookContext } from '../../context/BookContext';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { getNames, getCode } from 'country-list';
import countryData from 'country-telephone-data';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import valid from 'card-validator';
import './Checkout.css';
import axios from 'axios';

const Checkout = () => {
  const { cart } = useBookContext();
  const navigate = useNavigate();

  const DELIVERY_FEE = 7.5;
  const TAX_RATE = 0.10;

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [focus, setFocus] = useState('');
  const [errors, setErrors] = useState({});

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const countries = getNames().map(country => ({
    value: country,
    label: country
  }));

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price);
    if (isNaN(price)) return sum;
    return sum + (price * item.quantity);
  }, 0);

  const tax = subtotal * TAX_RATE;
  const totalPayable = subtotal + DELIVERY_FEE + tax;

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);

    const countryCode = getCode(selectedOption.value);
    if (countryCode) {
      const countryInfo = countryData.allCountries.find(
        (country) => country.iso2.toUpperCase() === countryCode.toUpperCase()
      );

      if (countryInfo) {
        setPhoneNumber('+' + countryInfo.dialCode);
      } else {
        setPhoneNumber('');
      }
    }
  };

  const handleCardNumberChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    input = input.slice(0, 16);
    setCardNumber(input);

    const validation = valid.number(input);
    if (validation.card) {
      setSelectedCard(validation.card.type);
    }
  };

  const handleExpiryChange = (e) => {
    let input = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (input.length >= 3) {
      input = input.slice(0, 2) + '/' + input.slice(2);
    }
    setExpiry(input);
  };

  const handleCvcChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    input = input.slice(0, selectedCard === 'amex' ? 4 : 3);
    setCvc(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!selectedCountry) newErrors.selectedCountry = "Please select your country/region";
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!cardName.trim()) newErrors.cardName = "Card holder name is required";
    if (!cardNumber.trim()) newErrors.cardNumber = "Card number is required";
    if (!expiry.trim()) newErrors.expiry = "Expiry date is required";
    if (!cvc.trim()) newErrors.cvc = "CVC is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const response = await axios.post('http://localhost:8000/api/orders/', {
        first_name: firstName,
        last_name: lastName,
        address,
        postal_code: postalCode,
        country: selectedCountry.value,
        phone: phoneNumber,
        cart_items: cart,
        total: totalPayable.toFixed(2),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const trackingNumber = response.data.tracking_number;

      navigate('/order-success', { state: { trackingNumber } });

    } catch (error) {
      console.error("Failed to submit order:", error);
      alert("Something went wrong while placing your order.");
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-left">
        <div className="section">
          <h2 className="section-title">🚚 Shipping Address</h2>
          <form className="checkout-form">
            <div className="form-group">
              <label>Country/Region <span className="required-star">*</span></label>
              <Select
                options={countries}
                value={selectedCountry}
                onChange={handleCountryChange}
                placeholder="Select Country/Region"
              />
              {errors.selectedCountry && <div className="error-text">{errors.selectedCountry}</div>}
            </div>

            <div className="form-inline">
              <div className="form-group">
                <label>First Name <span className="required-star">*</span></label>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && <div className="error-text">{errors.firstName}</div>}
              </div>
              <div className="form-group">
                <label>Last Name <span className="required-star">*</span></label>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && <div className="error-text">{errors.lastName}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>Address <span className="required-star">*</span></label>
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <div className="error-text">{errors.address}</div>}
            </div>

            <div className="form-inline">
              <div className="form-group">
                <label>City</label>
                <input type="text" placeholder="City" />
              </div>
              <div className="form-group">
                <label>Postal Code <span className="required-star">*</span></label>
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
                {errors.postalCode && <div className="error-text">{errors.postalCode}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number <span className="required-star">*</span></label>
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {errors.phoneNumber && <div className="error-text">{errors.phoneNumber}</div>}
            </div>
          </form>
        </div>

        <div className="section">
          <h2 className="section-title">💳 Payment Information</h2>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <Cards
              number={cardNumber}
              name={cardName}
              expiry={expiry}
              cvc={cvc}
              focused={focus}
            />

            <div className="form-group">
              <label>Card Holder Name <span className="required-star">*</span></label>
              <input
                type="text"
                name="name"
                placeholder="Card Holder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                onFocus={(e) => setFocus(e.target.name)}
              />
              {errors.cardName && <div className="error-text">{errors.cardName}</div>}
            </div>

            <div className="form-group">
              <label>Card Number <span className="required-star">*</span></label>
              <input
                type="text"
                name="number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                onFocus={(e) => setFocus(e.target.name)}
              />
              {errors.cardNumber && <div className="error-text">{errors.cardNumber}</div>}
            </div>

            <div className="form-inline">
              <div className="form-group">
                <label>Expiry Date (MM/YY) <span className="required-star">*</span></label>
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={handleExpiryChange}
                  onFocus={(e) => setFocus(e.target.name)}
                />
                {errors.expiry && <div className="error-text">{errors.expiry}</div>}
              </div>
              <div className="form-group">
                <label>CVC <span className="required-star">*</span></label>
                <input
                  type="text"
                  name="cvc"
                  placeholder="CVC"
                  value={cvc}
                  onChange={handleCvcChange}
                  onFocus={(e) => setFocus(e.target.name)}
                />
                {errors.cvc && <div className="error-text">{errors.cvc}</div>}
              </div>
            </div>

            <button className="checkout-button" type="submit">Complete the order</button>
          </form>
        </div>
      </div>

      <div className="checkout-right">
        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="summary-line">
            <span>Subtotal ({cart.reduce((total, item) => total + item.quantity, 0)} items):</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-line">
            <span>Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="summary-line">
            <span>Delivery:</span>
            <span>${DELIVERY_FEE.toFixed(2)}</span>
          </div>

          <div className="summary-line total">
            <span>Total Payable:</span>
            <span>${totalPayable.toFixed(2)}</span>
          </div>

          <button className="edit-cart-button" onClick={() => window.history.back()}>
            Edit Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
