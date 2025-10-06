// app/components/AuthProvider.js
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Cek role user dari Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(firebaseUser);
            setUserRole(userData.role || 'user'); // Default role adalah 'user'
          } else {
            // Jika user tidak ada di Firestore, logout
            await auth.signOut();
            setUser(null);
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          await auth.signOut();
          setUser(null);
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    // Jika tidak login dan bukan di halaman login, redirect ke login
    if (!user && pathname !== '/login') {
      router.replace('/login');
      return;
    }

    // Jika sudah login dan di halaman login, redirect ke dashboard
    if (user && pathname === '/login') {
      router.replace('/');
      return;
    }

    // Jika sudah login tapi bukan admin, redirect ke halaman unauthorized
    if (user && userRole !== 'admin' && pathname !== '/login' && pathname !== '/unauthorized') {
      router.replace('/unauthorized');
      return;
    }
  }, [loading, user, userRole, pathname, router]);

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
  if (user && userRole === 'admin' && pathname !== '/login') {
    return <>{children}</>;
  }

  if (!user && pathname === '/login') {
    return <>{children}</>;
  }

  if (user && userRole !== 'admin' && pathname === '/unauthorized') {
    return <>{children}</>;
  }

  return null;
}