import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('memoai_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const storedToken = localStorage.getItem('memoai_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data.data);
        } catch (err) {
          console.warn('Session expired or invalid token');
          localStorage.removeItem('memoai_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: authToken, user: userData } = res.data.data;
    localStorage.setItem('memoai_token', authToken);
    setToken(authToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token: authToken, user: userData } = res.data.data;
    localStorage.setItem('memoai_token', authToken);
    setToken(authToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('memoai_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
