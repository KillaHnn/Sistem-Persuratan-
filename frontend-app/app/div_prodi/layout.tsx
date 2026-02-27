import Sidebara from "./components/sidebar";

export default function DivProdiLayout({
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
