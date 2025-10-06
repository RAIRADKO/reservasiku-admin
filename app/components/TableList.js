'use client'
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function TableList() {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({ number: "", capacity: "" });
  const [editingTable, setEditingTable] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      const tablesCollection = collection(db, "tables");
      const tableSnapshot = await getDocs(tablesCollection);
      const tableList = tableSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTables(tableList);
    };

    fetchTables();
  }, []);

  const handleAdd = async () => {
    if (!newTable.number || !newTable.capacity) {
      alert("Nomor meja dan kapasitas harus diisi.");
      return;
    }
    const docRef = await addDoc(collection(db, "tables"), {
      number: parseInt(newTable.number),
      capacity: parseInt(newTable.capacity),
      isAvailable: true
    });
    setTables([...tables, { id: docRef.id, ...newTable, isAvailable: true, number: parseInt(newTable.number), capacity: parseInt(newTable.capacity) }]);
    setNewTable({ number: "", capacity: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus meja ini?")) {
      await deleteDoc(doc(db, "tables", id));
      setTables(tables.filter(table => table.id !== id));
    }
  };

  const handleUpdate = async (id) => {
    const tableToUpdate = tables.find(table => table.id === id);
    const tableRef = doc(db, "tables", id);
    await updateDoc(tableRef, {
      number: parseInt(tableToUpdate.number),
      capacity: parseInt(tableToUpdate.capacity)
    });
    setEditingTable(null);
  };

  const handleEditChange = (e, id) => {
    const { name, value } = e.target;
    setTables(tables.map(table => table.id === id ? { ...table, [name]: value } : table));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="number"
          placeholder="Nomor Meja Baru"
          value={newTable.number}
          onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
          className="border p-3 rounded-lg w-full md:w-auto"
        />
        <input
          type="number"
          placeholder="Kapasitas Meja"
          value={newTable.capacity}
          onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
          className="border p-3 rounded-lg w-full md:w-auto"
        />
        <button onClick={handleAdd} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
          Tambah Meja
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Meja</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kapasitas</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tables.map(table => (
              <tr key={table.id}>
                <td className="py-4 px-6 whitespace-nowrap">
                  {editingTable === table.id ? (
                    <input
                      type="number"
                      name="number"
                      value={table.number}
                      onChange={(e) => handleEditChange(e, table.id)}
                      className="border p-2 rounded-lg"
                    />
                  ) : (
                    table.number
                  )}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {editingTable === table.id ? (
                    <input
                      type="number"
                      name="capacity"
                      value={table.capacity}
                      onChange={(e) => handleEditChange(e, table.id)}
                      className="border p-2 rounded-lg"
                    />
                  ) : (
                    table.capacity
                  )}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${table.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {table.isAvailable ? "Tersedia" : "Dipesan"}
                    </span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                  {editingTable === table.id ? (
                    <button onClick={() => handleUpdate(table.id)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Simpan</button>
                  ) : (
                    <button onClick={() => setEditingTable(table.id)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">Edit</button>
                  )}
                  <button onClick={() => handleDelete(table.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 ml-2">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}