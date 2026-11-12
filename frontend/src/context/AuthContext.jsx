import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('routewise_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [fuelSettings, setFuelSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('routewise_fuel_settings');
      return saved ? JSON.parse(saved) : { fuel_type: 'Petrol', mileage: 15.0, fuel_price: 102.5 };
    } catch {
      return { fuel_type: 'Petrol', mileage: 15.0, fuel_price: 102.5 };
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('routewise_token'));
  const [loading, setLoading] = useState(true);

  // Sync state on initial load
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('routewise_user', JSON.stringify(res.user));
            if (res.fuelSettings) {
              setFuelSettings(res.fuelSettings);
              localStorage.setItem('routewise_fuel_settings', JSON.stringify(res.fuelSettings));
            }
          }
        } catch (err) {
          console.warn('[Auth] Token verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    }

    loadUser();

    // Listen for auth-expired event from API interceptor
    const handleExpired = () => {
      logout();
    };
    window.addEventListener('auth-expired', handleExpired);
    return () => window.removeEventListener('auth-expired', handleExpired);
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('routewise_token', res.token);
      localStorage.setItem('routewise_user', JSON.stringify(res.user));
      if (res.fuelSettings) {
        setFuelSettings(res.fuelSettings);
        localStorage.setItem('routewise_fuel_settings', JSON.stringify(res.fuelSettings));
      }
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  // Register handler
  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('routewise_token', res.token);
      localStorage.setItem('routewise_user', JSON.stringify(res.user));
      if (res.fuelSettings) {
        setFuelSettings(res.fuelSettings);
        localStorage.setItem('routewise_fuel_settings', JSON.stringify(res.fuelSettings));
      }
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('routewise_token');
    localStorage.removeItem('routewise_user');
  };

  // Update fuel preferences
  const updateSettings = async (settings) => {
    setFuelSettings(settings);
    localStorage.setItem('routewise_fuel_settings', JSON.stringify(settings));

    if (token) {
      try {
        const res = await api.put('/fuel/settings', settings);
        if (res.fuelSettings) {
          setFuelSettings(res.fuelSettings);
          localStorage.setItem('routewise_fuel_settings', JSON.stringify(res.fuelSettings));
        }
      } catch (err) {
        console.warn('[Auth] Failed to sync settings to server:', err.message);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        fuelSettings,
        loading,
        login,
        register,
        logout,
        updateSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
