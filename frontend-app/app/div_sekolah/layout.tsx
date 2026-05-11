import Sidebar from "../div_sekolah/components/sidebar"; // Reusing the sidebar component as it's flexible

export default function DivSekolahLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <Sidebar />
            <main className="flex-1 p-8 md:p-12">
                {children}
            </main>
        </div>
    );
}
