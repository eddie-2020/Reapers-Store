
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(false);
    const [lastActivity, setLastActivity] = useState(Date.now());

    useEffect(() => {
        // ... (existing token logic)
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            setUser({ name: 'Admin' });
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    }, [token]);

    // Activity Tracker
    const updateActivity = useCallback(() => {
        setLastActivity(Date.now());
    }, []);

    useEffect(() => {
        if (!token) return;

        // Listeners for activity
        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('click', updateActivity);
        window.addEventListener('scroll', updateActivity);

        // Check for inactivity every minute
        const intervalId = setInterval(() => {
            const now = Date.now();
            if (now - lastActivity > INACTIVITY_LIMIT) {
                logout(false); // pass false to avoid double toast if user clicks logout manually (to be implemented)
                toast.error("Session expired due to inactivity.");
            }
        }, 60000); // Check every minute

        return () => {
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('click', updateActivity);
            window.removeEventListener('scroll', updateActivity);
            clearInterval(intervalId);
        };
    }, [token, lastActivity, updateActivity]);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/token-auth/', {
                username,
                password
            });
            const newToken = response.data.token;
            setToken(newToken);
            localStorage.setItem('adminToken', newToken);
            setLastActivity(Date.now());
            toast.success("Welcome back, Admin!");
            return true;
        } catch (error) {
            console.error("Login failed", error);
            const msg = error.response?.data?.non_field_errors?.[0] || "Invalid credentials";
            toast.error(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = (manual = true) => {
        setToken(null);
        localStorage.removeItem('adminToken');
        setUser(null);
        if (manual) toast.success("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
