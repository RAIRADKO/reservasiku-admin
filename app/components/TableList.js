'use client'
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function TableList() {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({ number: "", capacity: "" });

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
    const docRef = await addDoc(collection(db, "tables"), {
      number: parseInt(newTable.number),
      capacity: parseInt(newTable.capacity),
      isAvailable: true
    });
    setTables([...tables, { id: docRef.id, ...newTable, isAvailable: true }]);
    setNewTable({ number: "", capacity: "" });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tables", id));
    setTables(tables.filter(table => table.id !== id));
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          type="number"
          placeholder="Nomor Meja"
          value={newTable.number}
          onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Kapasitas"
          value={newTable.capacity}
          onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
          className="border p-2"
        />
        <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded">Tambah</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nomor Meja</th>
              <th className="py-2 px-4 border-b">Kapasitas</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tables.map(table => (
              <tr key={table.id}>
                <td className="py-2 px-4 border-b">{table.number}</td>
                <td className="py-2 px-4 border-b">{table.capacity}</td>
                <td className="py-2 px-4 border-b">{table.isAvailable ? "Tersedia" : "Dipesan"}</td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleDelete(table.id)} className="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}