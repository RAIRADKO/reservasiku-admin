import Link from 'next/link';
import { Users, Grid3x3, Calendar } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Dashboard Admin</h1>
      <p className="text-lg text-gray-600 mb-10">Selamat datang di panel admin ReservasiKu.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/users" className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Users className="text-blue-500" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Manajemen Pengguna</h2>
              <p className="mt-1 text-gray-500">Kelola data pengguna</p>
            </div>
          </div>
        </Link>

        <Link href="/tables" className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-4 rounded-full">
              <Grid3x3 className="text-green-500" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Manajemen Meja</h2>
              <p className="mt-1 text-gray-500">Tambah dan edit meja</p>
            </div>
          </div>
        </Link>

        <Link href="/reservations" className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-4 rounded-full">
              <Calendar className="text-yellow-500" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Manajemen Reservasi</h2>
              <p className="mt-1 text-gray-500">Setujui atau tolak reservasi</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}