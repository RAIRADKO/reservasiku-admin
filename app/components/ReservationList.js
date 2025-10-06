'use client'
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const reservationsCollection = collection(db, "reservations");
      const reservationSnapshot = await getDocs(reservationsCollection);
      const reservationList = reservationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReservations(reservationList);
    };

    fetchReservations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const reservationRef = doc(db, "reservations", id);
    await updateDoc(reservationRef, { status: newStatus });
    setReservations(reservations.map(res => res.id === id ? { ...res, status: newStatus } : res));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus reservasi ini?")) {
        await deleteDoc(doc(db, "reservations", id));
        setReservations(reservations.filter(res => res.id !== id));
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Disetujui':
        return 'bg-green-100 text-green-800';
      case 'Ditolak':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
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
          {reservations.map(res => (
            <tr key={res.id}>
              <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{res.userId}</td>
              <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{res.tableNumber}</td>
              <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{res.date}</td>
              <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{res.time}</td>
              <td className="py-4 px-6 whitespace-nowrap">
                <select 
                  value={res.status}
                  onChange={(e) => handleStatusChange(res.id, e.target.value)}
                  className={`p-2 border rounded-lg ${getStatusClass(res.status)}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </td>
              <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleDelete(res.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}