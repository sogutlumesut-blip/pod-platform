import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 bg-slate-50 p-8 overflow-y-auto max-h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
