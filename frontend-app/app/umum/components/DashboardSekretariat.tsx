"use client";

export default function DashboardSekretariat({ surats, stats, renderListContainer }: any) {
  // Custom statistik khusus Sekretariat jika diperlukan
  const permohonanBaru = surats.filter((s: any) => s.status === "menunggu").length;

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Dashboard Sekretariat</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Ada <span className="font-semibold text-orange-500">{permohonanBaru} permohonan baru</span> yang perlu diproses.</p>
      </div>

      {/* Stats Grid — 6 card: Total, Terkirim, Diproses, Selesai, Diarsipkan, Dikembalikan */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats && stats.map((stat: any, i: number) => (
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

      {/* List Surat */}
      {renderListContainer("Antrean Kerja & Arsip Surat")}
    </div>
  );
}