// app/login/page.js
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Ganti 'passwordrahasia' dengan password admin Anda
    if (password === 'passwordrahasia') {
      // Set cookie jika password benar
      document.cookie = "admin_session=true; path=/; max-age=86400"; // Cookie berlaku 1 hari
      router.push('/');
    } else {
      alert('Password salah!');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan password"
          className="w-full p-3 border rounded-lg mb-4"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}