import Sidebar from "./components/SideBar";
import IdleLogoutProvider from "./components/IdleLogoutProvider";

export default function UmumLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <IdleLogoutProvider>
            <div className="flex min-h-screen bg-gray-50/50 flex-col md:flex-row">
                <Sidebar />
                <main className="flex-1 p-4 pt-20 sm:p-5 md:p-6 lg:p-7 md:pt-6 min-w-0 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </IdleLogoutProvider>
    );
}

