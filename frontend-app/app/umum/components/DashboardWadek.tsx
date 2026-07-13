"use client";

export default function DashboardWadek({ surats, renderListContainer }: { surats: any[]; renderListContainer: (titleLabel: string) => React.ReactNode }) {
  const butuhParaf = surats.filter((s) => s.status === "diverifikasi").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard Wakil Dekan
        </h1>
        <p className="text-gray-500 mt-1">
          Ada <span className="font-semibold text-purple-600">{butuhParaf} surat</span> menunggu paraf Anda.
        </p>
      </div>

      {renderListContainer("Persetujuan Paraf Surat")}
    </div>
  );
}
