"use client";
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const router = useRouter();

  // Check if tokens are valid and not expired
  const checkTokenValidity = () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const adminData = localStorage.getItem('admin');

      if (!accessToken || !refreshToken || !adminData) {
        clearAuth();
        return false;
      }

      // Decode access token to check expiration
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          // Token expired, try to refresh or logout
          handleTokenExpiration();
          return false;
        }

        setAdmin(JSON.parse(adminData));
        setIsAuthenticated(true);
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

  const handleTokenExpiration = () => {
    // You can implement token refresh logic here if needed
    console.log('Token expired, redirecting to login');
    clearAuth();
    router.push('/login');
  };

  const clearAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('admin');
    setIsAuthenticated(false);
    setAdmin(null);
  };

  useEffect(() => {
    checkTokenValidity();
    setIsLoading(false);

    // Listen for storage changes (e.g., from other tabs)
    const handleStorageChange = () => {
      checkTokenValidity();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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