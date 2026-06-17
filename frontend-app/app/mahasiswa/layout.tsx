    import Sidebar from "@/app/mahasiswa/components/SideBar";

    export default function UserLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
            {children}
        </main>
        </div>
    );
    }
