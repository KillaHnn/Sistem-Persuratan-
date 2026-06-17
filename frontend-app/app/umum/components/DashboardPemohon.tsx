    "use client";

    import Link from "next/link";
    import { FilePlus2, FileText, ChevronRight } from "lucide-react";

    export default function DashboardPemohon({ surats, stats, filters, activeFilter, setActiveFilter, filtered, formatDate, STATUS_MAP, JENIS_MAP, renderListContainer }: any) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Pemohon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Dashboard Pemohon</h1>
            <p className="text-gray-500 mt-1">Kelola dan pantau pengajuan surat Anda.</p>
            </div>
            <Link href="/umum/buat-surat" className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 active:scale-95">
            <FilePlus2 size={18} />
            <span className="font-medium">Buat Surat Baru</span>
            </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat: any, i: number) => (
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

        {/* Main Content List */}
        {renderListContainer("Daftar Permohonan Surat")}
        </div>
    );
    }