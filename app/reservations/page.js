import ReservationList from "../components/ReservationList";
import { Calendar } from "lucide-react";

export default function ReservationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
          <Calendar size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Reservasi</h1>
          <p className="text-gray-600 mt-1">Monitor dan kelola semua reservasi pelanggan</p>
        </div>
      </div>
      <ReservationList />
    </div>
  );
}