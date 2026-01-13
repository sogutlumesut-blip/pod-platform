"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Plus, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function BillingPage() {
    return (
        <div className="space-y-10">

            {/* Payment Card Section */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold">Payment Card</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-3xl">
                        Please provide your credit/ debit card. Unless agreed otherwise, you will be charged upon sending an order to production. Please note that we only accept Visa, Mastercard, American Expresss, China UnionPay, Discover & Diners Club, eftpos Australia and Japan Credit Bureau (JCB).
                    </p>
                </div>

                {/* Add Card Placeholder */}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group w-full max-w-md h-64">
                    <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 text-slate-500">
                        <div className="relative">
                            <CreditCard className="h-8 w-8" />
                            <Plus className="h-3 w-3 absolute -bottom-1 -right-1 bg-slate-500 text-white rounded-full p-0.5" />
                        </div>
                    </div>
                    <span className="font-bold text-slate-600 dark:text-slate-400 text-lg">Add a credit/debit card</span>
                </div>
            </section>

            <Separator />

            {/* Invoices Section */}
            <section className="space-y-6">

                {/* No Invoices Banner */}
                <div className="bg-[#FFF8F0] dark:bg-amber-900/10 p-6 rounded-lg flex items-start gap-4">
                    <div className="bg-[#FF6B55] rounded-full p-1 mt-0.5 shrink-0">
                        <Info className="h-4 w-4 text-white" strokeWidth={3} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">No Invoices Generated Yet</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Once an invoice is generated it will appear here. Also this section allows you to make payments for your invoices directly.
                        </p>
                    </div>
                </div>

                <div className="pt-2">
                    <Button size="lg" className="bg-[#FF7D5F] hover:bg-[#FF7D5F]/90 text-white min-w-[200px] h-12 text-base font-semibold shadow-sm">
                        Download Account Statement
                    </Button>
                </div>

            </section>

        </div>
    );
}
