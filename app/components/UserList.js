'use client'
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, userName) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${userName}"?\n\nCATATAN: Ini hanya menghapus data dari Firestore, tidak menghapus akun Firebase Auth.`)) {
      try {
        await deleteDoc(doc(db, "users", id));
        setUsers(users.filter(user => user.id !== id));
        alert("Pengguna berhasil dihapus");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Gagal menghapus pengguna");
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-500">Memuat data pengguna...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-500">Tidak ada data pengguna</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{user.name || 'N/A'}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{user.email || 'N/A'}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleDelete(user.id, user.name)} 
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
    </div>
  );
}