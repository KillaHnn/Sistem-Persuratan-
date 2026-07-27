import Sidebar from "./components/SideBar";

export default function UmumLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50/50 flex-col md:flex-row">
            <Sidebar />
            <main className="flex-1 p-4 pt-20 sm:p-6 md:p-8 md:pt-8 lg:p-12 min-w-0">
                {children}
            </main>
        </div>
    );
}
