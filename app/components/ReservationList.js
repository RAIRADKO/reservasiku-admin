// app/components/ReservationList.js
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
    await deleteDoc(doc(db, "reservations", id));
    setReservations(reservations.filter(res => res.id !== id));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Meja</th>
            <th className="py-2 px-4 border-b">Tanggal</th>
            <th className="py-2 px-4 border-b">Waktu</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(res => (
            <tr key={res.id}>
              <td className="py-2 px-4 border-b">{res.userId}</td>
              <td className="py-2 px-4 border-b">{res.tableNumber}</td>
              <td className="py-2 px-4 border-b">{res.date}</td>
              <td className="py-2 px-4 border-b">{res.time}</td>
              <td className="py-2 px-4 border-b">
                <select 
                  value={res.status}
                  onChange={(e) => handleStatusChange(res.id, e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b">
                  <button onClick={() => handleDelete(res.id)} className="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}