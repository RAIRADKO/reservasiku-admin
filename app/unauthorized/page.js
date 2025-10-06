// app/unauthorized/page.js
'use client';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <ShieldAlert className="text-red-600" size={48} />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Akses Ditolak
        </h1>
        
        <p className="text-gray-600 mb-6">
          Maaf, Anda tidak memiliki izin untuk mengakses panel admin ini. 
          Hanya akun dengan role <span className="font-semibold text-red-600">admin</span> yang dapat masuk.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Logout dan Kembali ke Login
          </button>
          
          <p className="text-sm text-gray-500">
            Jika Anda merasa ini adalah kesalahan, hubungi administrator.
          </p>
        </div>
      </div>
    </div>
  );
}