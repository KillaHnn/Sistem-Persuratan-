"use client";

import { useState } from "react";
import {
    Search,
    PlusCircle,
    FilePlus,
    Filter,
    MoreVertical,
    Download,
    Printer,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

interface Column {
    header: string;
    key: string;
}

interface RegistrationTableProps {
    title: string;
    columns: Column[];
    data: any[];
    onAddType1?: () => void;
    onAddType2?: () => void;
}

export default function RegistrationTable({
    title,
    columns,
    data,
    onAddType1,
    onAddType2
}: RegistrationTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("hal");

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola data {title.toLowerCase()} di sini.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onAddType1}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100 font-medium text-sm"
                    >
                        <PlusCircle size={18} />
                        <span>Tambah Format A</span>
                    </button>
                    <button
                        onClick={onAddType2}
                        className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm"
                    >
                        <FilePlus size={18} className="text-blue-600" />
                        <span>Tambah Format B</span>
                    </button>
                </div>
            </div>

            {/* Controls Section */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder={`Cari berdasarkan ${filterBy === 'hal' ? 'perihal' : 'nomor surat'}...`}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl">
                        <Filter size={16} className="text-gray-500" />
                        <span className="text-xs font-medium text-gray-600 mr-1">Filter:</span>
                        <select
                            className="bg-transparent border-none focus:ring-0 text-xs font-semibold text-gray-800 cursor-pointer"
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                        >
                            <option value="hal">Perihal (Hal)</option>
                            <option value="nomor">Nomor Surat</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                {columns.map((col) => (
                                    <th key={col.key} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-gray-800 transition-colors group">
                                            {col.header}
                                            <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.length > 0 ? (
                                data.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                        {columns.map((col) => (
                                            <td key={col.key} className="px-6 py-4">
                                                <div className="text-sm text-gray-700 font-medium capitalize">
                                                    {row[col.key]}
                                                </div>
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-400">
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Menampilkan 1-10 dari {data.length} data</span>
                    <div className="flex items-center gap-2">
                        <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors disabled:opacity-50" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1">
                            <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm">1</span>
                            <span className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-medium cursor-pointer">2</span>
                        </div>
                        <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
