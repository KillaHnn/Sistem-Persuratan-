"use client";

import { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreVertical,
  Plus
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Diajukan");
  const tabs = ["Diajukan", "Diproses", "Disetujui", "Ditolak"];

  // Mock data for statistics
  const stats = [
    { title: "Total Surat", value: "12", icon: FileText, color: "bg-blue-500" },
    { title: "Menunggu", value: "4", icon: Clock, color: "bg-yellow-500" },
    { title: "Disetujui", value: "6", icon: CheckCircle, color: "bg-green-500" },
    { title: "Ditolak", value: "2", icon: XCircle, color: "bg-red-500" },
  ];

  // Mock data for letters
  const letters = [
    { id: "001/SPC/II/2026", title: "Surat Pengajuan Cuti", date: "17 Feb 2026", status: "Diajukan", recipient: "Prodi" },
    { id: "002/SIT/II/2026", title: "Surat Izin Tidak Masuk", date: "16 Feb 2026", status: "Diproses", recipient: "sekolah" },
    { id: "003/SK/I/2026", title: "Surat Keterangan Kerja", date: "10 Jan 2026", status: "Disetujui", recipient: "admin" },
    { id: "004/SPD/XII/2025", title: "Surat Perjalanan Dinas", date: "20 Dec 2025", status: "Ditolak", recipient: "admin" },
    { id: "005/SPC/II/2026", title: "Surat Pengajuan Cuti Tahunan", date: "18 Feb 2026", status: "Diajukan", recipient: "admin" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Diajukan": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Diproses": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Disetujui": return "bg-green-100 text-green-700 border-green-200";
      case "Ditolak": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredLetters = letters.filter(letter => letter.status === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Selamat datang kembali, User!</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-gray-200 active:scale-95">
          <Plus size={18} />
          <span className="font-medium">Buat Surat Baru</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                <stat.icon size={22} className={stat.color.replace('bg-', 'text-')} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 w-full sm:w-72 focus-within:ring-2 focus-within:ring-black/5 transition-all">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Cari surat..."
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 w-full sm:w-auto overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            Surat {activeTab}
            <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredLetters.length}
            </span>
          </h2>

          <div className="space-y-4">
            {filteredLetters.length > 0 ? (
              filteredLetters.map((letter) => (
                <div
                  key={letter.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl hidden sm:flex">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {letter.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>{letter.id}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{letter.date}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>To: {letter.recipient}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 sm:mt-0 gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(letter.status)}`}>
                      {letter.status}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <FileText size={32} />
                </div>
                <h3 className="text-gray-900 font-medium">Tidak ada surat</h3>
                <p className="text-gray-500 text-sm mt-1">Belum ada surat dengan status "{activeTab}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
