// app/login/page.js
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth'; // <-- Tambahkan ini
import { auth } from '../lib/firebase'; // <-- Tambahkan ini

export default function LoginPage() {
  const [email, setEmail] = useState(''); // <-- Ganti dari password menjadi email
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => { // <-- Jadikan fungsi ini async
    e.preventDefault();
    try {
      // Lakukan login dengan Firebase
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      console.error("Error signing in: ", error);
      alert('Email atau Password salah!');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Masukkan email"
          className="w-full p-3 border rounded-lg mb-4"
        />
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