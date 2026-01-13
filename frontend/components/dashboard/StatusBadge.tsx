"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase();

    let variantClass = "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

    switch (normalizedStatus) {
        case "in production":
            variantClass = "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
            break;
        case "shipped":
            variantClass = "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
            break;
        case "cancelled":
            variantClass = "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
            break;
        case "new":
            variantClass = "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
            break;
        case "on hold":
            variantClass = "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
            break;
    }

    return (
        <Badge variant="outline" className={cn("capitalize px-2.5 py-0.5 rounded-full font-semibold shadow-sm border", variantClass)}>
            {status}
        </Badge>
    );
}
