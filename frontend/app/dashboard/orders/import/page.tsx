"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/lib/config";
import { Loader2, ArrowRight, ShoppingBag, Truck, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

type Order = {
    id: number;
    external_id: string;
    source: string;
    recipient_name: string;
    created_at: string;
    line_items_json: string;
    status: string;
};

export default function ImportOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Fetch draft orders from backend (which includes mock Etsy/Shopify orders)
            const res = await fetch(`${API_URL}/integrations/orders`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
            toast({
                title: "Error",
                description: "Failed to load imported orders",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleConfigure = (orderId: number) => {
        // Navigate to manual wizard but pre-filled (to be implemented: edit mode)
        // For now, allow quick "accept" or edit
        toast({
            title: "Configuration",
            description: "Redirecting to product configuration...",
        });
        // In real app: router.push(`/dashboard/create-order/manual?orderId=${orderId}`);
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Imported Drafts</h1>
                    <p className="text-muted-foreground mt-2">
                        These orders were synced from your stores but need product details (dimensions, files) before production.
                    </p>
                </div>
                <Button variant="outline" onClick={fetchOrders}>
                    Refresh
                </Button>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Source</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items (Raw)</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => {
                                const items = JSON.parse(order.line_items_json || "[]");
                                return (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {order.source}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{order.external_id}</TableCell>
                                        <TableCell>{order.recipient_name}</TableCell>
                                        <TableCell className="max-w-[300px] truncate text-muted-foreground text-sm">
                                            {items.map((i: any) => `${i.quantity}x ${i.title}`).join(", ")}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" onClick={() => handleConfigure(order.id)}>
                                                Configure <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No draft orders found. sync your store first!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
