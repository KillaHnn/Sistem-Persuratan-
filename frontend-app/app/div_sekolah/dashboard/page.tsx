"use client";

import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Calendar
} from "lucide-react";

export default function DashboardPage() {
    // Mock Data for Statistics
    const stats = [
        {
            title: "Total Surat",
            value: "842",
            trend: "+8%",
            icon: FileText,
            color: "bg-emerald-500",
            lightColor: "bg-emerald-50",
            textColor: "text-emerald-600"
        },
        {
            title: "Menunggu",
            value: "15",
            trend: "+2",
            icon: Clock,
            color: "bg-yellow-500",
            lightColor: "bg-yellow-50",
            textColor: "text-yellow-600"
        },
        {
            title: "Disetujui",
            value: "710",
            trend: "+15%",
            icon: CheckCircle,
            color: "bg-green-500",
            lightColor: "bg-green-50",
            textColor: "text-green-600"
        },
        {
            title: "Ditolak",
            value: "12",
            trend: "-1%",
            icon: XCircle,
            color: "bg-red-500",
            lightColor: "bg-red-50",
            textColor: "text-red-600"
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Divisi Sekolah</h1>
                    <p className="text-gray-500">Selamat datang kembali!</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <Calendar size={18} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.lightColor} ${stat.textColor}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-500">{stat.title}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-64 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <Activity size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Sistem Persuratan Digital</h2>
                <p className="text-gray-500 max-w-md mt-2">Gunakan menu di samping untuk mengelola surat menyurat sekolah.</p>
            </div>
        </div>
    );
}

import { Activity } from "lucide-react";
