// app/page.js
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Selamat Datang di Panel Admin</h1>
      <p className="mb-8">Pilih menu di bawah ini untuk mulai mengelola data:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/users" className="block p-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors">
          <h2 className="text-2xl font-semibold">Manajemen Pengguna</h2>
          <p className="mt-2">Lihat dan kelola data pengguna.</p>
        </Link>
        <Link href="/tables" className="block p-6 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors">
          <h2 className="text-2xl font-semibold">Manajemen Meja</h2>
          <p className="mt-2">Tambah dan hapus data meja.</p>
        </Link>
        <Link href="/reservations" className="block p-6 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-colors">
          <h2 className="text-2xl font-semibold">Manajemen Reservasi</h2>
          <p className="mt-2">Lihat dan ubah status reservasi.</p>
        </Link>
      </div>
    </div>
  );
}