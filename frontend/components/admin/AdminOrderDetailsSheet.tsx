"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    CreditCard,
    Truck,
    Box,
    User,
    CheckCircle2,
    Clock,
    Calendar,
    FileText
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { API_URL } from "@/lib/config";

interface AdminOrderDetailsSheetProps {
    order: any | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStatusChange: (status: string, tracking?: string) => void;
}

export function AdminOrderDetailsSheet({ order, open, onOpenChange, onStatusChange }: AdminOrderDetailsSheetProps) {
    const [trackingNumber, setTrackingNumber] = useState("");

    if (!order) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
                <div className="flex flex-col h-full">

                    {/* Header */}
                    <div className="p-6 border-b bg-muted/10">
                        <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="bg-background text-sm">
                                #{order.id}
                            </Badge>
                            <Badge className={
                                order.status === 'paid' ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                    order.status === 'pending' ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                                        order.status === 'production' ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                                            order.status === 'shipped' ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-100" :
                                                "bg-slate-100 text-slate-700"
                            }>
                                {order.status.toUpperCase()}
                            </Badge>
                        </div>
                        <SheetTitle className="text-2xl font-bold">{order.product_type}</SheetTitle>
                        <SheetDescription className="flex items-center gap-2 mt-1">
                            <User className="h-4 w-4" /> {order.user}
                            <span>•</span>
                            <Calendar className="h-4 w-4" /> {new Date(order.date).toLocaleDateString()}
                        </SheetDescription>
                    </div>

                    {/* Content Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* 1. Payment & Proof */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <CreditCard className="h-4 w-4" /> Payment Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg border">
                                <div>
                                    <Label className="text-muted-foreground text-xs">Amount</Label>
                                    <div className="font-mono text-lg font-bold">${order.amount.toFixed(2)}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Payment Proof</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        {order.proof ? (
                                            <Button variant="outline" size="sm" className="h-8 gap-2 text-blue-600">
                                                <FileText className="h-3 w-3" /> View Receipt
                                            </Button>
                                        ) : (
                                            <span className="text-sm text-yellow-600">No proof uploaded</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* 2. Product Specs */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Box className="h-4 w-4" /> Production Specs
                            </h3>
                            <div className="flex gap-6">
                                <div className="relative h-40 w-40 bg-slate-100 rounded-lg overflow-hidden border flex-shrink-0">
                                    {order.image_url && <Image src={order.image_url} alt="Design" fill className="object-cover" />}
                                </div>
                                <div className="space-y-3 flex-1">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-muted-foreground text-xs">Dimensions</Label>
                                            <div className="font-medium">{order.dimensions}</div>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground text-xs">Material</Label>
                                            <div className="font-medium">{order.material}</div>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground text-xs">Quantity</Label>
                                            <div className="font-medium">1 Unit</div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="pt-2">
                                            <Button
                                                variant="outline"
                                                className="w-full gap-2 border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700"
                                                onClick={async () => {
                                                    try {
                                                        const res = await fetch(`${API_URL}/admin/orders/${order.id}/production-file`, {
                                                            method: 'POST'
                                                        });
                                                        if (!res.ok) throw new Error('Generation failed');

                                                        // Trigger download
                                                        const blob = await res.blob();
                                                        const url = window.URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = `order_${order.id}_production.pdf`;
                                                        document.body.appendChild(a);
                                                        a.click();
                                                        window.URL.revokeObjectURL(url);

                                                        // Optional: notify status change
                                                        if (onStatusChange) onStatusChange('production');
                                                    } catch (e) {
                                                        console.error(e);
                                                        alert("Failed to generate production file");
                                                    }
                                                }}
                                            >
                                                <Box className="h-4 w-4" /> Generate & Download Production PDF
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* 3. Shipping / Fulfillment */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Truck className="h-4 w-4" /> Fulfillment
                            </h3>

                            {order.status === 'production' && (
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-blue-900">Ready to Ship?</h4>
                                            <p className="text-sm text-blue-700">Enter tracking number to complete this order.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Tracking Number (e.g. TRK123456)"
                                            className="bg-white"
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {order.status === 'shipped' && (
                                <div className="bg-green-50 border border-green-100 p-4 rounded-lg flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    <div>
                                        <h4 className="font-bold text-green-900">Shipped</h4>
                                        <p className="text-sm text-green-700">Tracking: <span className="font-mono">{order.tracking_number || "N/A"}</span></p>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t bg-slate-50 mt-auto">
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>

                            {order.status === 'pending' && (
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => onStatusChange('production')}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Verify Payment & Start Production
                                </Button>
                            )}

                            {order.status === 'production' && (
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => onStatusChange('shipped', trackingNumber)}
                                    disabled={!trackingNumber}
                                >
                                    <Truck className="mr-2 h-4 w-4" /> Mark as Shipped
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent >
        </Sheet >
    );
}
