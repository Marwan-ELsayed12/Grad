import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';
import { userService } from '../api/userService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (localStorage.getItem('token')) {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                setError('Failed to initialize authentication');
                toast.error('Session expired. Please login again.');
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login({ email, password });
            setUser(response.user || response);
            toast.success('Welcome back!');
            return response;
        } catch (err) {
            const errorMessage = err.message || 'Login failed. Please try again.';
            toast.error(errorMessage);
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            toast.success('Registration successful! Please log in.');
            return response;
        } catch (err) {
            const errorMessage = err.message || 'Registration failed. Please try again.';
            toast.error(errorMessage);
            throw err;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        toast.info('You have been logged out');
    };

    const updateProfile = async (userData) => {
        try {
            const response = await userService.updateProfile(userData);
            setUser(response);
            toast.success('Profile updated successfully');
            return response;
        } catch (err) {
            const errorMessage = err.message || 'Failed to update profile. Please try again.';
            toast.error(errorMessage);
            throw err;
        }
    };

    const changePassword = async (oldPassword, newPassword) => {
        try {
            await userService.changePassword({ old_password: oldPassword, new_password: newPassword });
            toast.success('Password changed successfully');
        } catch (err) {
            const errorMessage = err.message || 'Failed to change password. Please try again.';
            toast.error(errorMessage);
            throw err;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                logout,
                register,
                updateProfile,
                changePassword,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};