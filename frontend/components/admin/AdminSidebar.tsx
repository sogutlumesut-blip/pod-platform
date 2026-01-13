"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, CreditCard, LayoutDashboard, FileText, Settings, LogOut } from "lucide-react";

const sidebarNavItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "User Management",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Payments & Orders",
        href: "/admin/payments",
        icon: CreditCard,
    },
    {
        title: "Content",
        href: "/admin/content",
        icon: FileText,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();

    return (
        <aside className={cn("hidden lg:block w-64 bg-slate-900 min-h-screen text-slate-100 p-4", className)}>
            <div className="flex items-center gap-2 mb-8 px-2 font-bold text-xl">
                <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white font-mono">
                    A
                </div>
                <span>Admin Panel</span>
            </div>

            <nav className="flex flex-col space-y-1">
                {sidebarNavItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-red-500 text-white"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto absolute bottom-4 w-[calc(100%-2rem)]">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 w-full transition-colors">
                    <LogOut className="h-4 w-4" />
                    Exit Admin
                </button>
            </div>
        </aside>
    );
}
