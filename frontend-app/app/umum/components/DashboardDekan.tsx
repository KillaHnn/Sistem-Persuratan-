"use client";

export default function DashboardDekan({ surats, renderListContainer }: { surats: any[]; renderListContainer: (titleLabel: string) => React.ReactNode }) {
  const butuhTtd = surats.filter((s) => s.status === "diverifikasi").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard Dekan
        </h1>
        <p className="text-gray-500 mt-1">
          Ada <span className="font-semibold text-green-600">{butuhTtd} surat</span> menunggu tandatangan Anda.
        </p>
      </div>

      {renderListContainer("Persetujuan Tandatangan Surat")}
    </div>
  );
}
