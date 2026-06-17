"use client";

import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardSekretariat({ surats, stats, filtered, formatDate, STATUS_MAP, JENIS_MAP, renderListContainer }: any) {
  // Custom statistik khusus Sekretariat jika diperlukan
  const permohonanBaru = surats.filter((s: any) => s.status === "menunggu").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Dashboard Sekretariat</h1>
        <p className="text-gray-500 mt-1">Ada <span className="font-semibold text-orange-500">{permohonanBaru} permohonan baru</span> yang perlu di proses.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats && stats.map((stat: any, i: number) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 group cursor-default">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${stat.color} shadow-md group-hover:scale-105 transition-transform`}>
                <stat.icon size={22} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
            </div>
            <h3 className={`text-sm font-semibold ${stat.text}`}>{stat.title}</h3>
          </div>
        ))}
      </div>

      {/* List Surat */}
      {renderListContainer("Antrean Kerja & Arsip Surat")}
    </div>
  );
}