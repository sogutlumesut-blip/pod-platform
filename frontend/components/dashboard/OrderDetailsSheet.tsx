"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Box, Truck, Calendar, CreditCard } from "lucide-react";
import Image from "next/image";
import { StatusBadge } from "./StatusBadge";

interface OrderDetailsSheetProps {
    order: any | null; // Typed loosely for now, matching OrdersTable mock data structure
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OrderDetailsSheet({ order, open, onOpenChange }: OrderDetailsSheetProps) {
    if (!order) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-2xl font-bold">{order.orderId}</SheetTitle>
                        <StatusBadge status={order.status} />
                    </div>
                    <SheetDescription>
                        Placed on {new Date(order.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-8">
                    {/* Product Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                            <Box className="h-4 w-4" /> Product Details
                        </h3>
                        <div className="flex gap-4">
                            <div className="relative h-24 w-24 bg-slate-100 rounded-lg overflow-hidden border flex-shrink-0">
                                {order.designImage ? (
                                    <Image src={order.designImage} alt="Product" fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">Img</div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium text-lg leading-none">{order.product}</p>
                                <p className="text-sm text-muted-foreground">Quantity: 1</p>
                                <p className="text-sm font-medium pt-1">${order.totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Delivery Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Shipping Address
                        </h3>
                        <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-1">
                            <p className="font-semibold">{order.deliveryName}</p>
                            <p>123 Example Street</p>
                            <p>New York, NY 10001</p>
                            <p>United States</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Mock Timeline */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                            <Truck className="h-4 w-4" /> Order History
                        </h3>
                        <div className="relative pl-6 border-l-2 border-muted space-y-8 my-4 ml-2">
                            {/* Latest Event */}
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Order status updated to {order.status}</p>
                                    <p className="text-xs text-muted-foreground">Just now</p>
                                </div>
                            </div>
                            {/* Past Events */}
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-muted-foreground/30 border-2 border-background" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Order Confirmed</p>
                                    <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
