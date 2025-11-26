"use client";
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const router = useRouter();
  const isInitialized = useRef(false);

  const clearAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('admin');
    setIsAuthenticated(false);
    setAdmin(null);
  };

  const checkTokenValidity = () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const adminData = localStorage.getItem('admin');

      if (!accessToken || !adminData) {
        clearAuth();
        return false;
      }

      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          clearAuth();
          window.dispatchEvent(new Event('tokenExpired'));
          return false;
        }

        // Only update state if not already authenticated
        if (!isAuthenticated) {
          setAdmin(JSON.parse(adminData));
          setIsAuthenticated(true);
        }
        return true;
      } catch (error) {
        console.error('Token decode error:', error);
        clearAuth();
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      clearAuth();
      return false;
    }
  };

  useEffect(() => {
    // Only run once on mount
    if (!isInitialized.current) {
      isInitialized.current = true;
      checkTokenValidity();
      setIsLoading(false);

      const handleStorageChange = () => {
        checkTokenValidity();
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const login = (authData) => {
    const { accessToken, refreshToken, admin } = authData;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('admin', JSON.stringify(admin));
    setAdmin(admin);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      admin,
      login,
      logout,
      checkTokenValidity
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};