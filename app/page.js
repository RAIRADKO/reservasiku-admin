'use client'
import { useState, useEffect } from "react";
import Link from 'next/link';
import { db } from "./lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Users, Calendar, Grid3x3, TrendingUp } from "lucide-react";

export default function HomePage() {
  const [stats, setStats] = useState({
    users: 0,
    tables: 0,
    reservations: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const tablesSnap = await getDocs(collection(db, "tables"));
        const reservationsSnap = await getDocs(collection(db, "reservations"));
        
        const reservations = reservationsSnap.docs.map(doc => doc.data());
        const pending = reservations.filter(r => r.status === "Pending").length;

        setStats({
          users: usersSnap.size,
          tables: tablesSnap.size,
          reservations: reservationsSnap.size,
          pending
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Pengguna",
      value: stats.users,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Meja",
      value: stats.tables,
      icon: Grid3x3,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Reservasi",
      value: stats.reservations,
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const quickActions = [
    {
      title: "Manajemen Pengguna",
      description: "Lihat dan kelola data pengguna",
      href: "/users",
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      title: "Manajemen Meja",
      description: "Tambah dan hapus data meja",
      href: "/tables",
      icon: Grid3x3,
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      title: "Manajemen Reservasi",
      description: "Lihat dan ubah status reservasi",
      href: "/reservations",
      icon: Calendar,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Selamat datang kembali! Berikut ringkasan sistem Anda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={stat.textColor} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 overflow-hidden relative"
              >
                <div className="relative z-10">
                  <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Reservasi Baru</p>
              <p className="text-sm text-gray-600">Ada {stats.pending} reservasi menunggu konfirmasi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}