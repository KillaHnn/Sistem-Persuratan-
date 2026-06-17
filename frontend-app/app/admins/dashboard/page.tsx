"use client";

import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    Activity,
    MoreHorizontal,
    Calendar
} from "lucide-react";

export default function DashboardPage() {
    // Mock Data for Statistics
    const stats = [
        {
            title: "Total Surat",
            value: "1,248",
            trend: "+12%",
            icon: FileText,
            color: "bg-blue-500",
            lightColor: "bg-blue-50",
            textColor: "text-blue-600"
        },
        {
            title: "Menunggu",
            value: "42",
            trend: "+5",
            icon: Clock,
            color: "bg-yellow-500",
            lightColor: "bg-yellow-50",
            textColor: "text-yellow-600"
        },
        {
            title: "Disetujui",
            value: "892",
            trend: "+24%",
            icon: CheckCircle,
            color: "bg-green-500",
            lightColor: "bg-green-50",
            textColor: "text-green-600"
        },
        {
            title: "Ditolak",
            value: "34",
            trend: "-2%",
            icon: XCircle,
            color: "bg-red-500",
            lightColor: "bg-red-50",
            textColor: "text-red-600"
        },
    ];

    const recentActivities = [
        {
            id: 1,
            user: "Budi Santoso",
            action: "mengajukan",
            target: "Surat Izin Cuti",
            time: "2 jam yang lalu",
            status: "pending",
            avatar: "https://ui-avatars.com/api/?name=Budi+Santoso&background=random"
        },
        {
            id: 2,
            user: "Siti Aminah",
            action: "menyetujui",
            target: "Surat Keterangan Aktif",
            time: "4 jam yang lalu",
            status: "approved",
            avatar: "https://ui-avatars.com/api/?name=Siti+Aminah&background=random"
        },
        {
            id: 3,
            user: "Ahmad Rizki",
            action: "mengajukan",
            target: "Surat Pengantar Magang",
            time: "5 jam yang lalu",
            status: "pending",
            avatar: "https://ui-avatars.com/api/?name=Ahmad+Rizki&background=random"
        },
        {
            id: 4,
            user: "System",
            action: "menolak",
            target: "Pengajuan #SPC-001",
            time: "1 hari yang lalu",
            status: "rejected",
            avatar: "https://ui-avatars.com/api/?name=System&background=000&color=fff"
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-500">Selamat datang kembali, Admin!</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <Calendar size={18} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 group cursor-default">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${stat.color} shadow-md group-hover:scale-105 transition-transform`}>
                                <stat.icon size={24} className="text-white" />
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                        <p className={`text-sm font-semibold ${stat.textColor}`}>{stat.title}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Section (Mock Visual) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Statistik Pengajuan Surat</h2>
                        <select className="bg-gray-50 border-none text-sm rounded-lg px-3 py-2 text-gray-600 focus:ring-0 cursor-pointer">
                            <option>Bulan Ini</option>
                            <option>Tahun Ini</option>
                        </select>
                    </div>

                    {/* Simple CSS Bar Chart Mockup */}
                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        {[45, 60, 75, 50, 80, 65, 90, 70, 55, 85, 95, 100].map((height, i) => (
                            <div key={i} className="w-full flex flex-col items-center gap-2 group">
                                <div
                                    className="w-full bg-blue-100 rounded-t-lg relative group-hover:bg-blue-200 transition-all duration-300"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {height * 12}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Aktivitas Terbaru</h2>
                        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
                    </div>

                    <div className="space-y-6">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex gap-4 items-start">
                                <img src={activity.avatar} alt={activity.user} className="w-10 h-10 rounded-full border border-gray-100" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800">
                                        <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold text-gray-600">{activity.target}</span>
                                    </p>
                                    <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                        <Clock size={12} /> {activity.time}
                                    </span>
                                </div>
                                <div className={`w-2 h-2 rounded-full mt-2
                    ${activity.status === 'approved' ? 'bg-green-500' :
                                        activity.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}
                 `}></div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors">
                        Lihat Semua Aktivitas
                    </button>
                </div>
            </div>
        </div>
    );
}
