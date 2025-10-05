import TableList from "../components/TableList";
import { Grid3x3 } from "lucide-react";

export default function TablesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
          <Grid3x3 size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Meja</h1>
          <p className="text-gray-600 mt-1">Tambah, edit, dan hapus meja restoran</p>
        </div>
      </div>
      <TableList />
    </div>
  );
}