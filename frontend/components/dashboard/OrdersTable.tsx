"use client";

import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Search, Filter, Plus } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import Image from "next/image";
import { OrderDetailsSheet } from "./OrderDetailsSheet";
import { OrderConfigurationDialog } from "./OrderConfigurationDialog";

// Mock Data
type Order = {
    id: string;
    orderId: string;
    date: string; // ISO date string
    designImage: string;
    deliveryName: string;
    product: string;
    totalPrice: number;
    status: "New" | "In Production" | "On Hold" | "Shipped" | "Cancelled" | "Other";
    userEmail?: string; // Add ownership
};

// Keep existing ORDERS as a fallback/demo for the main admin/demo user if needed, 
// or simpler: just start empty for new users.
const DEMO_ORDERS: Order[] = [
    { id: "1", orderId: "ORD-001235", date: "2025-12-07T10:00:00", designImage: "/placeholder-design-1.jpg", deliveryName: "John Doe", product: "Custom Wallpaper (120x250 cm)", totalPrice: 135.00, status: "In Production", userEmail: "sogutlumesut@gmail.com" },
    { id: "2", orderId: "ORD-001234", date: "2025-12-06T14:30:00", designImage: "/placeholder-design-2.jpg", deliveryName: "Jane Smith", product: "Canvas Print (50x70 cm)", totalPrice: 45.00, status: "Shipped", userEmail: "sogutlumesut@gmail.com" },
    { id: "3", orderId: "ORD-001233", date: "2025-12-05T09:15:00", designImage: "/placeholder-design-3.jpg", deliveryName: "Robert Brown", product: "Peel & Stick Sample", totalPrice: 5.00, status: "New", userEmail: "sogutlumesut@gmail.com" },
];

const ORDERS: Order[] = [
    { id: "1", orderId: "ORD-001235", date: "2025-12-07T10:00:00", designImage: "/placeholder-design-1.jpg", deliveryName: "John Doe", product: "Custom Wallpaper (120x250 cm)", totalPrice: 135.00, status: "In Production" },
    { id: "2", orderId: "ORD-001234", date: "2025-12-06T14:30:00", designImage: "/placeholder-design-2.jpg", deliveryName: "Jane Smith", product: "Canvas Print (50x70 cm)", totalPrice: 45.00, status: "Shipped" },
    { id: "3", orderId: "ORD-001233", date: "2025-12-05T09:15:00", designImage: "/placeholder-design-3.jpg", deliveryName: "Robert Brown", product: "Peel & Stick Sample", totalPrice: 5.00, status: "New" },
    { id: "4", orderId: "ORD-001230", date: "2025-12-01T16:45:00", designImage: "/placeholder-design-4.jpg", deliveryName: "Emily White", product: "Textured Vinyl (300x200)", totalPrice: 210.00, status: "Cancelled" },
    { id: "5", orderId: "ORD-001228", date: "2025-11-28T11:20:00", designImage: "/placeholder-design-5.jpg", deliveryName: "Michael Green", product: "Custom Wallpaper (100x100 cm)", totalPrice: 25.00, status: "Shipped" },
    { id: "6", orderId: "ORD-001225", date: "2025-11-25T13:00:00", designImage: "/placeholder-design-1.jpg", deliveryName: "Sarah Connor", product: "Canvas Fabric (200x200 cm)", totalPrice: 180.00, status: "Shipped" },
];

export function OrdersTable() {
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [currentUser, setCurrentUser] = React.useState<any>(null);
    const [statusFilter, setStatusFilter] = React.useState("All Orders");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
    const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = React.useState(false);

    React.useEffect(() => {
        // 1. Get User
        const session = localStorage.getItem("user_session");
        let userEmail = "";
        if (session) {
            try {
                const userData = JSON.parse(session);
                setCurrentUser(userData);
                userEmail = userData.email;
            } catch (e) {
                console.error("Failed to parse user session");
            }
        }

        // 2. Get Orders (Mock)
        // Check if we have orders in local storage, if not, verify if we should seed demo orders
        const storedOrders = localStorage.getItem("mock_orders");
        let allOrders: Order[] = [];

        if (storedOrders) {
            try {
                allOrders = JSON.parse(storedOrders);
            } catch (e) { console.error("Failed to parse mock orders"); }
        } else {
            // Seed demo orders for the first time
            // In a real app we wouldn't do this, but for this prototype let's save them
            // so we don't lose the demo look for the main user
            localStorage.setItem("mock_orders", JSON.stringify(DEMO_ORDERS));
            allOrders = DEMO_ORDERS;
        }

        // 3. Filter by User
        // If user is logged in, show ONLY their orders
        if (userEmail) {
            // For the demo purpose, if the user matches our "demo admin" (sogutlumesut@gmail.com), show demo orders.
            // For everyone else (e.g. "dudu"), show only orders that match their email.
            // Since DEMO_ORDERS have 'sogutlumesut@gmail.com', new users will see existing matching orders 
            // OR empty if they haven't created any.

            // Note: Since new registered users don't have orders yet, this will result in an empty list, which is CORRECT.
            const userOrders = allOrders.filter(o => o.userEmail === userEmail);
            setOrders(userOrders);
        } else {
            setOrders([]);
        }

    }, []);

    // Calculate Status Counts
    const statusCounts = React.useMemo(() => {
        const counts: Record<string, number> = {
            "All Orders": orders.length,
            "New": 0,
            "In Production": 0,
            "On Hold": 0,
            "Shipped": 0,
            "Cancelled": 0,
            "Other": 0
        };
        orders.forEach(order => {
            if (counts[order.status] !== undefined) {
                counts[order.status]++;
            } else {
                counts["Other"]++;
            }
        });
        return counts;
    }, [orders]);

    const filteredOrders = orders.filter(order => {
        // ... existing filter logic
        if (statusFilter !== "All Orders" && order.status !== statusFilter) return false;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                order.orderId.toLowerCase().includes(query) ||
                order.deliveryName.toLowerCase().includes(query) ||
                order.product.toLowerCase().includes(query)
            );
        }
        return true;
    });

    return (
        <div className="space-y-6">
            {/* ... Helper Note ... */}
            <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-1 rounded-full mt-0.5">
                    <span className="sr-only">Info</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                    <p className="font-semibold">Welcome to your order page!</p>
                    <p>Here you can find all orders that were sent for fulfillment, their status & other details. You can also create manual orders in this section.</p>
                </div>
            </div>

            <Tabs defaultValue="All Orders" className="w-full" onValueChange={setStatusFilter}>
                <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-2 md:gap-6 border-b rounded-none w-full justify-start pb-1 mb-6">
                    {["All Orders", "New", "In Production", "On Hold", "Shipped", "Cancelled", "Other"].map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-1 pb-3 text-muted-foreground hover:text-foreground transition-all flex items-center gap-2"
                        >
                            {tab}
                            <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                statusFilter === tab ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            )}>
                                {statusCounts[tab] || 0}
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-background/50"
                        />
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full md:w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    <Button variant="outline" className="md:ml-auto">
                        <Filter className="mr-2 h-4 w-4" />
                        More Filters
                    </Button>
                    <Button className="bg-black text-white hover:bg-slate-800" onClick={() => setIsNewOrderDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Order
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-[140px] font-semibold">Order</TableHead>
                                <TableHead className="font-semibold">Date</TableHead>
                                <TableHead className="font-semibold">Design</TableHead>
                                <TableHead className="font-semibold">Delivery name</TableHead>
                                <TableHead className="font-semibold">Product</TableHead>
                                <TableHead className="text-right font-semibold">Total Price</TableHead>
                                <TableHead className="font-semibold w-[140px]">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <TableCell className="font-semibold text-primary">{order.orderId}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(order.date).toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="relative h-12 w-12 rounded overflow-hidden border bg-slate-100">
                                                <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground bg-slate-100">Img</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{order.deliveryName}</TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={order.product}>{order.product}</TableCell>
                                        <TableCell className="text-right font-medium">${order.totalPrice.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={order.status} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {/* Pagination */}
                    <div className="border-t p-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {filteredOrders.length} of {orders.length} orders
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled>Previous</Button>
                            <Button variant="outline" size="sm" disabled>Next</Button>
                        </div>
                    </div>
                </div>
            </Tabs>

            <OrderDetailsSheet
                order={selectedOrder}
                open={!!selectedOrder}
                onOpenChange={(open) => !open && setSelectedOrder(null)}
            />

            <OrderConfigurationDialog
                open={isNewOrderDialogOpen}
                onOpenChange={setIsNewOrderDialogOpen}
                currentOrderId={undefined}
                onConfirm={(data) => {
                    // Refresh orders or add new mock order
                    console.log("Order confirmed with data:", data);
                }}
            />
        </div>
    );
}
