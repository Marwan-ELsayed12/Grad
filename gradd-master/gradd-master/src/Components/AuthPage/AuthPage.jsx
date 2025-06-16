import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './AuthPage.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return false;
        }
        if (!isLogin) {
            if (!formData.name) {
                setError('Please enter your name');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                // After successful registration, log the user in
                await login(formData.email, formData.password);
            }
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                {error && <ErrorMessage message={error} />}
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                            />
                        </div>
                    )}
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>
                <p className="auth-switch">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                        }}
                        className="switch-button"
                    >
                        {isLogin ? 'Register here' : 'Login here'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
