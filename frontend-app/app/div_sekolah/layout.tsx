import Sidebara from "../div_prodi/components/sidebar"; // Reusing the sidebar component as it's flexible

export default function DivSekolahLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <Sidebara />
            <main className="flex-1 p-8 md:p-12">
                {children}
            </main>
        </div>
    );
}
