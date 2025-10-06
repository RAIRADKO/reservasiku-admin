'use client'
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // All, Pending, Disetujui, Ditolak

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const reservationsCollection = collection(db, "reservations");
      const reservationSnapshot = await getDocs(reservationsCollection);
      const reservationList = reservationSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      // Urutkan berdasarkan tanggal terbaru
      reservationList.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
      setReservations(reservationList);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      alert("Gagal memuat data reservasi");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const reservationRef = doc(db, "reservations", id);
      await updateDoc(reservationRef, { status: newStatus });
      setReservations(reservations.map(res => 
        res.id === id ? { ...res, status: newStatus } : res
      ));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal mengubah status reservasi");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus reservasi ini?")) {
      try {
        await deleteDoc(doc(db, "reservations", id));
        setReservations(reservations.filter(res => res.id !== id));
      } catch (error) {
        console.error("Error deleting reservation:", error);
        alert("Gagal menghapus reservasi");
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Disetujui':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Ditolak':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredReservations = filter === 'All' 
    ? reservations 
    : reservations.filter(res => res.status === filter);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-500">Memuat data reservasi...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['All', 'Pending', 'Disetujui', 'Ditolak'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === status 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status} ({status === 'All' ? reservations.length : reservations.filter(r => r.status === status).length})
          </button>
        ))}
      </div>

      {filteredReservations.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          Tidak ada reservasi {filter !== 'All' ? `dengan status ${filter}` : ''}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meja</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReservations.map(res => (
                <tr key={res.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{res.userId || 'N/A'}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">Meja {res.tableNumber || 'N/A'}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{res.date || 'N/A'}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{res.time || 'N/A'}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <select 
                      value={res.status || 'Pending'}
                      onChange={(e) => handleStatusChange(res.id, e.target.value)}
                      className={`p-2 border rounded-lg cursor-pointer ${getStatusClass(res.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Disetujui">Disetujui</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(res.id)} 
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}