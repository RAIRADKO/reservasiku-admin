// app/components/AuthProvider.js
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    // Jika tidak login dan bukan di halaman login, redirect ke login
    if (!user && pathname !== '/login') {
      router.replace('/login');
    }

    // Jika sudah login dan di halaman login, redirect ke dashboard
    if (user && pathname === '/login') {
      router.replace('/');
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Render children hanya jika kondisi sesuai
  if (user && pathname !== '/login') {
    return <>{children}</>;
  }

  if (!user && pathname === '/login') {
    return <>{children}</>;
  }

  return null;
}