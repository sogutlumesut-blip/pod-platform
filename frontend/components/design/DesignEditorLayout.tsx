"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Redo, Save, Undo } from "lucide-react";
import Link from "next/link";

interface DesignEditorLayoutProps {
    children: ReactNode;
    sidebar: ReactNode;
    propertiesPanel: ReactNode;
    onSave?: () => void;
    onExport?: () => void;
}

export function DesignEditorLayout({
    children,
    sidebar,
    propertiesPanel,
    onSave,
    onExport
}: DesignEditorLayoutProps) {
    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
            {/* Design Header */}
            <header className="h-16 border-b bg-white px-4 flex items-center justify-between shrink-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/orders/new">
                        <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                            <ArrowLeft className="h-5 w-5 text-slate-500" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg text-slate-900">Product Designer</h1>
                        <p className="text-xs text-slate-500">Creating custom design for Order #NEW</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="hidden sm:flex">
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="hidden sm:flex">
                        <Redo className="h-4 w-4" />
                    </Button>
                    <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />
                    <Button variant="outline" onClick={onExport} className="gap-2">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Preview</span>
                    </Button>
                    <Button onClick={onSave} className="bg-[#FF6B55] hover:bg-[#FF6B55]/90 gap-2">
                        <Save className="h-4 w-4" />
                        Save Design
                    </Button>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Tools */}
                <aside className="w-[80px] sm:w-[280px] bg-white border-r flex flex-col z-10">
                    {sidebar}
                </aside>

                {/* Center - Canvas Area */}
                <main className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center p-8">
                    <div className="relative shadow-2xl">
                        {children}
                    </div>
                </main>

                {/* Right Sidebar - Properties */}
                <aside className="w-[300px] bg-white border-l hidden lg:flex flex-col z-10">
                    {propertiesPanel}
                </aside>
            </div>
        </div>
    );
}
