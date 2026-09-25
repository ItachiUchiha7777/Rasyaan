import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { signInWithGoogle } from '../firebase/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('rasyaan_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await API.get('/auth/me');
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('rasyaan_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('rasyaan_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    localStorage.setItem('rasyaan_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const loginWithGoogle = async () => {
    try {
      const googleUser = await signInWithGoogle();
      const payload = {
        googleId: googleUser.uid,
        email: googleUser.email,
        name: googleUser.displayName || 'Pahadi User',
        avatar: googleUser.photoURL || ''
      };
      const { data } = await API.post('/auth/google', payload);
      localStorage.setItem('rasyaan_token', data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Google Auth Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      // Ignore
    }
    localStorage.removeItem('rasyaan_token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const { data } = await API.put('/auth/profile', profileData);
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        refreshUser: fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
