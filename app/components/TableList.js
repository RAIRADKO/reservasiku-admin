'use client'
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { Trash2, Plus, Grid3x3, Users, CheckCircle, XCircle } from "lucide-react";

export default function TableList() {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({ number: "", capacity: "" });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tablesCollection = collection(db, "tables");
        const tableSnapshot = await getDocs(tablesCollection);
        const tableList = tableSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTables(tableList);
      } catch (error) {
        console.error("Error fetching tables:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const handleAdd = async () => {
    if (!newTable.number || !newTable.capacity) {
      alert("Mohon isi semua field");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "tables"), {
        number: parseInt(newTable.number),
        capacity: parseInt(newTable.capacity),
        isAvailable: true
      });
      setTables([...tables, { id: docRef.id, number: parseInt(newTable.number), capacity: parseInt(newTable.capacity), isAvailable: true }]);
      setNewTable({ number: "", capacity: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding table:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus meja ini?")) {
      try {
        await deleteDoc(doc(db, "tables", id));
        setTables(tables.filter(table => table.id !== id));
      } catch (error) {
        console.error("Error deleting table:", error);
      }
    }
  };

  const availableTables = tables.filter(t => t.isAvailable).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Meja</p>
              <p className="text-4xl font-bold mt-1">{tables.length}</p>
            </div>
            <Grid3x3 size={48} className="opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Tersedia</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{availableTables}</p>
            </div>
            <CheckCircle size={40} className="text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Dipesan</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{tables.length - availableTables}</p>
            </div>
            <XCircle size={40} className="text-orange-600" />
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Tambah Meja
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tambah Meja Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Meja</label>
              <input
                type="number"
                placeholder="Contoh: 1"
                value={newTable.number}
                onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kapasitas</label>
              <input
                type="number"
                placeholder="Contoh: 4"
                value={newTable.capacity}
                onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Simpan
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map(table => (
          <div
            key={table.id}
            className={`relative bg-white rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-lg ${
              table.isAvailable ? 'border-green-200' : 'border-orange-200'
            }`}
          >
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                table.isAvailable
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {table.isAvailable ? 'Tersedia' : 'Dipesan'}
              </span>
            </div>

            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white text-2xl font-bold mb-4">
              {table.number}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <Users size={18} className="mr-2" />
                <span className="text-sm">Kapasitas: <strong>{table.capacity} orang</strong></span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(table.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <Trash2 size={16} />
              Hapus
            </button>
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Grid3x3 size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Belum ada meja. Tambahkan meja pertama Anda!</p>
        </div>
      )}
    </div>
  );
}