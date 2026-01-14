"use client";

import { cn } from "@/lib/utils";
import {
    Home,
    PlusCircle,
    ShoppingBag,
    LayoutTemplate,
    Store,
    HelpCircle,
    BookOpen,
    Settings,
    ChevronLeft,
    LogOut
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const sidebarItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: PlusCircle, label: "Create order", href: "/dashboard/create-order" },
    { icon: ShoppingBag, label: "My orders", href: "/dashboard/orders" },
    { icon: LayoutTemplate, label: "Product Templates", href: "/dashboard/templates" },
    { icon: Store, label: "Stores", href: "/dashboard/stores" },
    { icon: HelpCircle, label: "Help Center", href: "/dashboard/help" },
    { icon: BookOpen, label: "Guides", href: "/dashboard/guides" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState<{ name: string, email: string }>({ name: "User Name", email: "user@example.com" });

    useEffect(() => {
        const session = localStorage.getItem("user_session");
        if (session) {
            try {
                const userData = JSON.parse(session);
                if (userData) {
                    setUser({
                        name: userData.name || "User Name",
                        email: userData.email || "user@example.com"
                    });
                }
            } catch (e) {
                console.error("Failed to parse user session");
            }
        }
    }, []);

    return (
        <div className={cn("flex flex-col border-r bg-background h-screen sticky top-0 transition-all duration-300", collapsed ? "w-[60px]" : "w-[240px]")}>
            <div className="h-16 flex items-center px-4 border-b gap-2">
                {/* Logo Area */}
                <div className={cn("flex items-center gap-2 font-bold text-xl overflow-hidden whitespace-nowrap", collapsed && "w-0 px-0")}>
                    <div className="h-8 w-8 min-w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        P
                    </div>
                    <span>PrintMarkt</span>
                </div>
                {collapsed && (
                    <div className="h-8 w-8 min-w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mx-auto">
                        P
                    </div>
                )}

                <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-muted-foreground hover:text-foreground">
                    <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
                </button>
            </div>

            <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                            pathname === item.href
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent",
                            collapsed && "justify-center px-2"
                        )}
                    >
                        <item.icon className="h-5 w-5 min-w-5" />
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t">
                <div className="p-4 border-t">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={cn("flex items-center gap-3 w-full hover:bg-muted p-2 rounded-md transition-colors text-left", collapsed ? "justify-center" : "")}>
                                <div className="h-8 w-8 min-w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                                    <span className="font-bold text-xs">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                                {!collapsed && (
                                    <div className="flex flex-col overflow-hidden leading-none">
                                        <span className="text-sm font-medium truncate">{user.name}</span>
                                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                    </div>
                                )}
                                {!collapsed && <LogOut className="ml-auto h-4 w-4 text-muted-foreground" />}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={() => {
                                localStorage.removeItem("user_session");
                                window.location.href = "/auth/login";
                            }}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
