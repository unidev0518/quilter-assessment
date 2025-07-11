import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  clearError: () => {}
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {

      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common['x-auth-token'] = token;

      try {

        const decoded: any = jwt_decode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {

          localStorage.removeItem('token');
          delete axios.defaults.headers.common['x-auth-token'];
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await axios.get('/auth');

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post('/auth/register', { name, email, password });

      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;

      const userRes = await axios.get('/auth');

      setIsAuthenticated(true);
      setUser(userRes.data);
      setError(null);
    } catch (err: any) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
      setIsAuthenticated(false);
      setUser(null);

      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Registration failed');
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;

      const userRes = await axios.get('/auth');

      setIsAuthenticated(true);
      setUser(userRes.data);
      setError(null);
    } catch (err: any) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
      setIsAuthenticated(false);
      setUser(null);

      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Login failed');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setIsAuthenticated(false);
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
