"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarNavItems = [
    {
        title: "My Account",
        href: "/dashboard/settings",
    },
    {
        title: "Billing",
        href: "/dashboard/settings/billing",
    },
    {
        title: "Security",
        href: "/dashboard/settings/security",
    },
    {
        title: "Notifications",
        href: "/dashboard/settings/notifications",
    },
    {
        title: "Integrations",
        href: "/dashboard/stores",
    },
];

export function SettingsSidebar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();

    return (
        <nav
            className={cn(
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 w-full",
                className
            )}
            {...props}
        >
            {sidebarNavItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "justify-start text-left font-medium px-4 py-2.5 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                        pathname === item.href || (item.href !== "/dashboard/settings" && pathname.startsWith(item.href))
                            ? "bg-[#FF7D5F]/10 text-[#FF7D5F] hover:bg-[#FF7D5F]/20 hover:text-[#FF7D5F]"
                            : "text-muted-foreground"
                    )}
                >
                    {item.title}
                </Link>
            ))}
        </nav>
    );
}
