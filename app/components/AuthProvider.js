// app/components/AuthProvider.js
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Ganti userRole menjadi isAdmin
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        // Paksa refresh token untuk mendapatkan custom claims terbaru
        firebaseUser.getIdTokenResult(true).then((idTokenResult) => {
          // Cek custom claim 'admin'
          const userIsAdmin = !!idTokenResult.claims.admin;
          setIsAdmin(userIsAdmin);
          setLoading(false);
        });
      } else {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login';
    const isUnauthorizedPage = pathname === '/unauthorized';

    // Jika belum login dan tidak di halaman login, redirect ke login
    if (!user && !isAuthPage) {
      router.replace('/login');
      return;
    }

    // Jika sudah login dan berada di halaman login, redirect ke dashboard
    if (user && isAuthPage) {
      router.replace('/');
      return;
    }

    // Jika user sudah login TAPI BUKAN admin, dan mencoba akses halaman terproteksi
    if (user && !isAdmin && !isAuthPage && !isUnauthorizedPage) {
      router.replace('/unauthorized');
      return;
    }

  }, [loading, user, isAdmin, pathname, router]);

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

  // Kondisi render anak
  const isAuthPage = pathname === '/login';
  const isUnauthorizedPage = pathname === '/unauthorized';

  // Jika user adalah admin dan tidak di halaman login
  if (user && isAdmin && !isAuthPage) {
    return <>{children}</>;
  }

  // Jika belum login dan berada di halaman login
  if (!user && isAuthPage) {
    return <>{children}</>;
  }

  // Jika user bukan admin dan berada di halaman unauthorized
  if (user && !isAdmin && isUnauthorizedPage) {
    return <>{children}</>;
  }
  
  // Jangan render apapun jika kondisi tidak terpenuhi (mencegah flash content)
  return null; 
}