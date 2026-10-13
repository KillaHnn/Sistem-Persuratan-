"use client";

import Link from "next/link";
import { FilePlus2 } from "lucide-react";

export default function DashboardPemohon({ stats, renderListContainer }: any) {
    return (
        <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-500">
            {/* Header Pemohon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Dashboard Pemohon</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Kelola dan pantau pengajuan surat Anda.</p>
                </div>
                <Link href="/umum/buat-surat" className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl hover:bg-orange-600 transition-all shadow-sm active:scale-95 text-xs sm:text-sm font-medium self-start sm:self-auto">
                    <FilePlus2 size={16} />
                    <span>Buat Surat Baru</span>
                </Link>
            </div>

            {/* Stats Grid — 5 card: Total, Terkirim, Diproses, Selesai, Dikembalikan */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {stats.map((stat: any, i: number) => (
                    <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 group cursor-default">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl ${stat.color} shadow-sm group-hover:scale-105 transition-transform`}>
                                <stat.icon size={20} className="text-white" />
                            </div>
                            <span className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</span>
                        </div>
                        <h3 className={`text-xs sm:text-sm font-semibold ${stat.text}`}>{stat.title}</h3>
                    </div>
                ))}
            </div>

            {/* Main Content List */}
            {renderListContainer("Daftar Permohonan Surat")}
        </div>
    );
}