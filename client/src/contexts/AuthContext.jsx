import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await apiClient('/api/users/me', { skipAuthRedirect: true });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        checkAuth();
      }, 5 * 60 * 1000); 

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);


  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'isAuthenticated') {
        if (e.newValue === null) {
          setUser(null);
          setIsAuthenticated(false);
        } else if (e.newValue === 'true' && !isAuthenticated) {
          checkAuth();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated]);

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await apiClient('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      await checkAuth();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await apiClient('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    }
  };

  const signup = async (userData) => {
    try {
      const response = await apiClient('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    signup,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
