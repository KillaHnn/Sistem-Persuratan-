"use client";

import { useState } from "react";

export default function PengajuanSuratPage() {
    return(
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-semibold text-gray-800">
                Pengajuan Surat 
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-7">
                Silakan isi formulir di bawah untuk mengajukan surat baru.
            </p>

            <div className="flex items-center gap-4">
                <label className="font-medium text-gray-700">
                    Jenis Surat :
                </label>

                <div className="relative w-64">
                    <select className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="">Pilih Jenis Surat</option>
                    <option>Surat Izin</option>
                    <option>Surat Keterangan</option>
                    <option>Surat Undangan</option>
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    ▼
                    </div>
                </div>
            </div>
        </div>
    );
}