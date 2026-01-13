"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, FileText, Info, AlertCircle, ShoppingCart, Store } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [userName, setUserName] = useState("User");

    useEffect(() => {
        const session = localStorage.getItem("user_session");
        if (session) {
            try {
                const user = JSON.parse(session);
                if (user.name) {
                    setUserName(user.name);
                }
            } catch (e) {
                console.error("Failed to parse user session");
            }
        }
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Welcome Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Welcome to PrintMarkt, {userName}</h1>
                <p className="text-muted-foreground">Here is what is happening with your store today.</p>
            </div>

            {/* Account Setup Warning/Action */}
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Set up your account</span>
                </div>
                <Button variant="ghost" size="sm" className="text-red-700 dark:text-red-400 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900">
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Onboarding Checklist */}
            <div className="bg-background rounded-xl border shadow-sm p-8">
                <div className="flex items-start justify-between mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider font-semibold">
                            Onboarding Checklist <Info className="h-4 w-4" />
                        </div>
                        <h2 className="text-2xl font-bold">Your Next Steps:</h2>
                    </div>
                    <div className="text-right">
                        <Link href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <ShoppingCart className="h-4 w-4" /> Help with ordering?
                        </Link>
                        <Link href="#" className="text-sm font-medium text-red-500 hover:underline">
                            Help Center
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Step 1 */}
                    <div className="border rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-primary transition-colors cursor-pointer bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-muted-foreground font-bold">1</div>
                            <h3 className="font-bold">Information</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                            <div className="h-2 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        </div>
                        <div className="mt-auto pt-4 flex items-center text-sm font-medium text-primary">
                            Start <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="border rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-primary transition-colors cursor-pointer bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-muted-foreground font-bold">2</div>
                            <h3 className="font-bold">Connect Store</h3>
                        </div>
                        <div className="flex items-center justify-center py-6 text-muted-foreground">
                            <Store className="h-12 w-12 opacity-20" />
                        </div>
                        <div className="mt-auto pt-4 flex items-center text-sm font-medium text-primary">
                            Connect <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="border rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-primary transition-colors cursor-pointer bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-muted-foreground font-bold">3</div>
                            <h3 className="font-bold">First Order</h3>
                        </div>
                        <div className="flex items-center justify-center py-6 text-muted-foreground">
                            <FileText className="h-12 w-12 opacity-20" />
                        </div>
                        <div className="mt-auto pt-4 flex items-center text-sm font-medium text-primary">
                            Create <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
