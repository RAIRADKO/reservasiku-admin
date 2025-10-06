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
    // Listener ini akan memeriksa perubahan status login
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Membersihkan listener saat komponen tidak lagi digunakan
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    // Jika pengguna TIDAK login dan TIDAK berada di halaman login,
    // alihkan (redirect) ke halaman login.
    if (!user && pathname !== '/login') {
      router.push('/login');
    }

    // Jika pengguna SUDAH login dan mencoba mengakses halaman login,
    // alihkan ke halaman utama (dashboard).
    if (user && pathname === '/login') {
      router.push('/');
    }
  }, [loading, user, pathname, router]);

  // Tampilkan layar loading saat status autentikasi sedang diperiksa
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  // Izinkan akses jika:
  // 1. Pengguna sudah login (dan tidak di halaman login)
  // 2. Pengguna belum login TAPI sedang di halaman login
  if ((user && pathname !== '/login') || (!user && pathname === '/login')) {
    return <>{children}</>;
  }

  // Jangan render apa-apa selama proses redirect
  return null;
}