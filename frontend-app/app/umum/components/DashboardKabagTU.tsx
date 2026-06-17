"use client";

export default function DashboardKabagTU({ surats, renderListContainer }: { surats: any[]; renderListContainer: (titleLabel: string) => React.ReactNode }) {
  const butuhPersetujuan = surats.filter((s) => s.status === "diproses").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard Kabag TU
        </h1>
        <p className="text-gray-500 mt-1">
          Ada <span className="font-semibold text-purple-600">{butuhPersetujuan} surat</span> menunggu verifikasi Anda.
        </p>
      </div>

      {renderListContainer("Persetujuan Draft Surat")}
    </div>
  );
}

