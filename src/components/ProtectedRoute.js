"use client";
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import Header from './Header';

export default function ProtectedLayout({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(!isLoading);
  const hasChecked = useRef(false);

  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/unauthorized'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (isLoading) return;

    if (!hasChecked.current) {
      hasChecked.current = true;
      
      if (!isAuthenticated && !isPublicRoute) {
        // Not authenticated and trying to access protected route
        router.push('/login');
      } else if (isAuthenticated && pathname === '/login') {
        // Authenticated but on login page - redirect to home
        router.push('/');
      }
      
      setIsCheckingAuth(false);
    }
  }, [isLoading, isAuthenticated, isPublicRoute, pathname, router]);

  // Token expiration handler
  useEffect(() => {
    const handleTokenExpired = () => {
      hasChecked.current = false;
      router.push('/login');
    };

    window.addEventListener('tokenExpired', handleTokenExpired);
    return () => window.removeEventListener('tokenExpired', handleTokenExpired);
  }, [router]);

  // Show loading while checking auth
  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show header for authenticated users on protected routes
  if (isAuthenticated && !isPublicRoute) {
    return (
      <>
        <main>{children}</main>
      </>
    );
  }

  // Show only content for public routes (login page)
  if (isPublicRoute) {
    return <main>{children}</main>;
  }

  // Not authenticated and not on public route
  return null;
}