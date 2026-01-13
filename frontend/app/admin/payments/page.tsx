"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye } from "lucide-react";
import { AdminOrderDetailsSheet } from "@/components/admin/AdminOrderDetailsSheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data with more details
interface MockOrder {
    id: number;
    user: string;
    amount: number;
    status: string;
    date: string;
    proof: string;
    product_type: string;
    dimensions: string;
    material: string;
    image_url: string;
    tracking_number?: string;
}

const mockOrders: MockOrder[] = [
    {
        id: 101,
        user: "Mesut Sogutlu",
        amount: 154.50,
        status: "pending",
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
        amount: 502.00,
        status: "production",
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
    const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
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
                <p className="text-slate-500">Review and approve pending order payments.</p>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-2 border-b rounded-none w-full justify-start pb-1 mb-6">
                    <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3">
                        All Orders <Badge variant="secondary" className="ml-2">{counts.all}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none px-4 pb-3">
                        Pending Payment <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700">{counts.pending}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="production" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 pb-3">
                        In Production <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">{counts.production}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="shipped" className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-4 pb-3">
                        Completed / Shipped <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">{counts.shipped}</Badge>
                    </TabsTrigger>
                </TabsList>

                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="cursor-pointer hover:bg-slate-50" onClick={() => { setSelectedOrder(order); setIsSheetOpen(true); }}>
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>{order.user}</TableCell>
                                        <TableCell className="max-w-[150px] truncate">{order.product_type}</TableCell>
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
