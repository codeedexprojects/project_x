"use client";
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isLoading, admin, checkTokenValidity } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const isValid = checkTokenValidity();
      
      if (!isValid || !isAuthenticated) {
        router.push('/login');
        return;
      }

      if (requireAdmin && (!admin || admin.role !== 'admin')) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, isLoading, admin, requireAdmin, router, checkTokenValidity]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  if (requireAdmin && (!admin || admin.role !== 'admin')) {
    return null; 
  }

  return children;
}