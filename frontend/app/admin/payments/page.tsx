"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, CreditCard } from "lucide-react";
import { AdminOrderDetailsSheet } from "@/components/admin/AdminOrderDetailsSheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data with more details
interface MockOrder {
    id: number;
    user: string;
    amount: number;
    status: string;
    description: string; // payment description
    payment_method: string;
    transaction_id?: string;
    date: string;
    proof: string;
    product_type: string;
    dimensions: string;
    material: string;
    image_url: string;
    tracking_number?: string;
    requester_email: string;
}

const mockOrders: MockOrder[] = [
    {
        id: 101,
        user: "Mesut Sogutlu",
        requester_email: "mesut@example.com",
        amount: 154.50,
        status: "pending",
        description: "Payment for Custom Wallpaper",
        payment_method: "Credit Card",
        transaction_id: "txn_89234xxxx",
        date: "2024-01-09T11:00:00",
        proof: "receipt_101.pdf",
        product_type: "Custom Wallpaper",
        dimensions: "350x240 cm",
        material: "Textured Vinyl ($25/m2)",
        image_url: "https://picsum.photos/id/1018/600/800",
        tracking_number: undefined
    },
    {
        id: 102,
        user: "Demo User",
        requester_email: "demo@example.com",
        amount: 502.00,
        status: "paid",
        description: "Payment for Canvas Print",
        payment_method: "PayPal",
        transaction_id: "pay_72834yyyy",
        date: "2024-01-08T14:20:00",
        proof: "receipt_102.pdf",
        product_type: "Canvas Print",
        dimensions: "100x150 cm",
        material: "Cotton Canvas 340g",
        image_url: "https://picsum.photos/id/237/600/800",
        tracking_number: undefined
    },
];

export default function AdminPaymentsPage() {
    const [orders, setOrders] = useState(mockOrders);
    const [selectedOrder, setSelectedOrder] = useState<MockOrder | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");

    const handleStatusChange = async (newStatus: string, trackingNumber?: string) => {
        if (selectedOrder) {
            let updatedOrder = { ...selectedOrder, status: newStatus };
            if (trackingNumber) {
                updatedOrder = { ...updatedOrder, tracking_number: trackingNumber };
            }

            setOrders(orders.map(o => o.id === selectedOrder.id ? updatedOrder : o));
            setSelectedOrder(updatedOrder);

            if (newStatus === 'shipped') {
                setIsSheetOpen(false);
            }

            // Backend Calls (Mocked)
            try {
                // ... fetch calls
            } catch (e) {
                console.error("Failed to update status", e);
            }
        }
    };

    // Calculate Counts
    const counts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        production: orders.filter(o => o.status === 'production').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
    };

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        if (activeTab === 'all') return true;
        return order.status === activeTab;
    });

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="space-y-8">
            <AdminOrderDetailsSheet
                order={selectedOrder}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                onStatusChange={handleStatusChange}
            />

            <div>
                <h1 className="text-3xl font-bold text-slate-900">Payments & Orders</h1>
                <p className="text-slate-500">Monitor incoming payments and order status.</p>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                {/* ... (TabsList unchanged) ... */}

                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Payment Method</TableHead>
                                <TableHead>Transaction Status</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Order Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="cursor-pointer hover:bg-slate-50" onClick={() => { setSelectedOrder(order); setIsSheetOpen(true); }}>
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{order.user}</span>
                                                <span className="text-xs text-muted-foreground">{order.requester_email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {order.payment_method === 'Credit Card' ? (
                                                    <CreditCard className="h-4 w-4 text-slate-500" />
                                                ) : (
                                                    <span className="font-bold text-blue-600 text-xs">P</span>
                                                )}
                                                {order.payment_method}
                                            </div>
                                            <span className="text-xs text-muted-foreground block max-w-[150px] truncate">{order.transaction_id || '-'}</span>
                                        </TableCell>
                                        <TableCell>
                                            {/* Payment Status (Derived from Order Status for now, or explicit) */}
                                            <Badge variant="secondary" className={
                                                order.status === 'paid' || order.status === 'production' || order.status === 'shipped'
                                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                    : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                            }>
                                                {order.status === 'pending' ? 'Pending' : 'Success'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>${order.amount.toFixed(2)}</TableCell>
                                        <TableCell>{formatDate(order.date)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                order.status === 'paid' ? "border-green-500 text-green-600 bg-green-50" :
                                                    order.status === 'pending' ? "border-amber-500 text-amber-600 bg-amber-50" :
                                                        order.status === 'production' ? "border-blue-500 text-blue-600 bg-blue-50" :
                                                            order.status === 'shipped' ? "border-indigo-500 text-indigo-600 bg-indigo-50" :
                                                                "bg-slate-100"
                                            }>
                                                {order.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                        No orders found in this category.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Tabs>
        </div>
    );
}
