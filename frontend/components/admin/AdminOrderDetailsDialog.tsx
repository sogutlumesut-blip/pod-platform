import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Package, User, CreditCard, Ruler, Layers, Truck } from "lucide-react";
import Image from "next/image";

interface Order {
    id: number;
    user: string;
    amount: number;
    status: string;
    date: string;
    proof?: string;
    product_type?: string;
    dimensions?: string;
    material?: string;
    image_url?: string;
    tracking_number?: string;
}

interface AdminOrderDetailsDialogProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStatusChange: (status: string, trackingNumber?: string) => void;
}

export function AdminOrderDetailsDialog({ order, open, onOpenChange, onStatusChange }: AdminOrderDetailsDialogProps) {
    const [isShipping, setIsShipping] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState("");

    if (!order) return null;

    const handleShipOrder = () => {
        if (trackingNumber.trim()) {
            onStatusChange("shipped", trackingNumber);
            setIsShipping(false);
            setTrackingNumber("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (!open) setIsShipping(false);
            onOpenChange(open);
        }}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-6">
                <DialogHeader className="px-1">
                    <div className="flex items-center justify-between w-full pr-8">
                        <div className="flex items-center gap-3">
                            <DialogTitle className="text-2xl font-bold tracking-tight">Order #{order.id}</DialogTitle>
                            <Badge variant="outline" className={`text-sm px-2.5 py-0.5 font-semibold ${order.status === 'paid' ? "border-green-500 text-green-700 bg-green-50" :
                                order.status === 'pending' ? "border-amber-500 text-amber-700 bg-amber-50" :
                                    order.status === 'production' ? "border-blue-500 text-blue-700 bg-blue-50" :
                                        order.status === 'shipped' ? "border-indigo-500 text-indigo-700 bg-indigo-50" :
                                            "bg-slate-100 text-slate-700"
                                }`}>
                                {order.status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                    <DialogDescription className="text-slate-500 mt-1.5" suppressHydrationWarning>
                        Placed on {order.date.split('T')[0].split('-').reverse().join('/')} at {order.date.split('T')[1].substring(0, 5)}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2 mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                        {/* Left Column: Product Visuals */}
                        <div className="space-y-4">
                            <div className="aspect-[4/3] w-full relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                                <Image
                                    src={order.image_url || "/placeholder-image.jpg"}
                                    alt="Product Preview"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <Button
                                className="w-full h-12 text-base font-semibold shadow-sm"
                                variant="outline"
                                onClick={async () => {
                                    if (!order.image_url) return;
                                    try {
                                        const response = await fetch(order.image_url);
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = `order-${order.id}-production.jpg`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        window.URL.revokeObjectURL(url);
                                    } catch (e) {
                                        console.error("Download failed", e);
                                        // Fallback if fetch fails (e.g. CORS), though this will still open new tab
                                        window.open(order.image_url, '_blank');
                                    }
                                }}
                            >
                                <Download className="mr-2 h-4 w-4" /> Download Production File
                            </Button>
                        </div>

                        {/* Right Column: Order Details */}
                        <div className="flex flex-col gap-6">
                            {/* Customer Info Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900">Customer Details</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                                        <span className="text-slate-500">Name</span>
                                        <span className="font-medium text-slate-900">{order.user}</span>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                                        <span className="text-slate-500">Email</span>
                                        <span className="font-medium text-slate-900 truncate" title="customer@example.com">customer@example.com</span>
                                    </div>
                                </div>
                            </div>

                            {/* Product Specs Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                        <Package className="h-4 w-4" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900">Specifications</h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Type</span>
                                        <Badge variant="secondary" className="font-medium">{order.product_type || "Custom Wallpaper"}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5" /> Dimensions</span>
                                        <span className="font-medium text-slate-900">{order.dimensions || "Unknown"}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" /> Material</span>
                                        <span className="font-medium text-slate-900 text-right max-w-[150px] leading-tight">{order.material || "Standard"}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Shipping</span>
                                        <div className="text-right">
                                            <span className="font-medium text-slate-900 block">Express (DHL)</span>
                                            {order.tracking_number && (
                                                <span className="text-xs text-blue-600 font-mono block mt-0.5">{order.tracking_number}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info Card */}
                            <div className="bg-slate-900 text-white rounded-xl shadow-sm p-5 space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                                    <CreditCard className="h-4 w-4 text-slate-300" />
                                    <h3 className="font-semibold">Payment Summary</h3>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-slate-400">Total Amount</span>
                                        <span className="text-2xl font-bold tracking-tight">${order.amount.toFixed(2)}</span>
                                    </div>
                                    {order.proof && (
                                        <Button variant="link" className="text-blue-300 hover:text-white p-0 h-auto text-sm">
                                            View Receipt &rarr;
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-8 pt-4 border-t border-slate-100 gap-2 sm:justify-between items-center">
                    <div className="flex-1 flex justify-start">
                        {isShipping ? (
                            <div className="flex items-center gap-2 w-full max-w-sm">
                                <Label htmlFor="tracking" className="whitespace-nowrap font-medium text-slate-700">Tracking #:</Label>
                                <Input
                                    id="tracking"
                                    placeholder="Enter tracking code..."
                                    className="h-9"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                />
                            </div>
                        ) : (
                            order.status === 'pending' && (
                                <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                                    Reject Order
                                </Button>
                            )
                        )}
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        {!isShipping && (
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Close
                            </Button>
                        )}

                        {isShipping ? (
                            <>
                                <Button variant="ghost" onClick={() => setIsShipping(false)}>Cancel</Button>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" onClick={handleShipOrder}>
                                    Confirm Shipment
                                </Button>
                            </>
                        ) : (
                            <>
                                {order.status === 'pending' && (
                                    <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md w-full sm:w-auto" onClick={() => onStatusChange("paid")}>
                                        Approve Payment
                                    </Button>
                                )}
                                {order.status === 'paid' && (
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md w-full sm:w-auto" onClick={() => onStatusChange("production")}>
                                        Send to Production
                                    </Button>
                                )}
                                {order.status === 'production' && (
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md w-full sm:w-auto" onClick={() => setIsShipping(true)}>
                                        Mark as Shipped
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
