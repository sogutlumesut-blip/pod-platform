"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, Info, Trash2, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { OrderConfigurationDialog } from "./OrderConfigurationDialog";

// Mock Data for Imported Orders
const IMPORTED_ORDERS = [
    {
        id: "ETSY-1001",
        customer: "Louise D. (Guest)",
        productName: "Canvas Framed",
        variant: "Variant A",
        sku: "SKU-1234",
        country: "Canada",
        countryCode: "CA",
        date: "13-11-2023",
        quantity: 1,
        image: "/placeholder-design-1.jpg",
        configured: false
    },
    {
        id: "ETSY-1002",
        customer: "Michael S.",
        productName: "Custom Wallpaper",
        variant: "Variant B",
        sku: "SKU-5678",
        country: "United Kingdom",
        countryCode: "GB",
        date: "13-11-2023",
        quantity: 1,
        image: "/placeholder-design-2.jpg",
        configured: true
    },
    {
        id: "ETSY-1003",
        customer: "Sarah J.",
        productName: "Peel & Stick",
        variant: "Variant C",
        sku: "SKU-9012",
        country: "United States",
        countryCode: "US",
        date: "12-11-2023",
        quantity: 2,
        image: "/placeholder-design-3.jpg",
        configured: false
    },
];

export function ImportedOrdersTable() {
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [orders, setOrders] = useState(IMPORTED_ORDERS);
    const [configDialogOpen, setConfigDialogOpen] = useState(false);
    const [configuringOrderId, setConfiguringOrderId] = useState<string | null>(null);

    const toggleSelectAll = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map(o => o.id));
        }
    };

    const toggleSelectOrder = (id: string) => {
        if (selectedOrders.includes(id)) {
            setSelectedOrders(selectedOrders.filter(o => o !== id));
        } else {
            setSelectedOrders([...selectedOrders, id]);
        }
    };

    const handleConfigureOrder = (orderId: string) => {
        setConfiguringOrderId(orderId);
        setConfigDialogOpen(true);
    };

    const handleConfigurationConfirmed = () => {
        if (configuringOrderId) {
            setOrders(orders.map(o =>
                o.id === configuringOrderId ? { ...o, configured: true } : o
            ));
        }
    };

    return (
        <div className="space-y-6">

            {/* Top Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Create order</h1>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="default" className="bg-[#FF7D5F] hover:bg-[#e66c4f] border-none text-white font-medium">Add shopify store</Button>
                    <Button variant="default" className="bg-[#FF7D5F] hover:bg-[#e66c4f] border-none text-white font-medium">Disconnect Etsy store</Button>
                    <Button variant="default" className="bg-[#FF7D5F] hover:bg-[#e66c4f] border-none text-white font-medium">Import Etsy Orders</Button>
                    <Link href="/dashboard/create-order/manual">
                        <Button variant="default" className="bg-[#FF7D5F] hover:bg-[#e66c4f] border-none text-white font-medium">Create order manually</Button>
                    </Link>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 px-6 py-4 rounded-lg flex items-start gap-4">
                <Info className="h-5 w-5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                <div className="space-y-1">
                    <p className="font-bold">Welcome to the &quot;Create order&quot; section!</p>
                    <p className="text-sm leading-relaxed text-blue-700/80 dark:text-blue-300/80">
                        Here you can choose which of your Shopify or Etsy orders you will import into our system, or create an order manually. We will not be able to see any of your other orders that you see here. Only those sent to Printseekers will be visible by Printseekers team.
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Filter result..." className="pl-9 h-11" />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground font-medium">Selected {selectedOrders.length} of {orders.length}</p>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10">
                        Delete orders
                    </Button>
                    <Button variant="default" className="bg-[#FF7D5F] hover:bg-[#e66c4f] text-white font-medium h-10">
                        Send to production
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <TableRow>
                            <TableHead className="w-[50px] pl-4">
                                <Checkbox
                                    checked={selectedOrders.length === orders.length && orders.length > 0}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Design</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Product Name + All Variants</TableHead>
                            <TableHead>Product SKU</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Order date</TableHead>
                            <TableHead className="text-right pr-4">Quantity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 cursor-pointer" onClick={() => handleConfigureOrder(order.id)}>
                                <TableCell className="pl-4">
                                    <Checkbox
                                        checked={selectedOrders.includes(order.id)}
                                        onCheckedChange={() => toggleSelectOrder(order.id)}
                                        // Stop propagation to prevent row click when just checking box
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="h-16 w-12 bg-slate-200 rounded relative overflow-hidden border">
                                        {/* Mock Image */}
                                        <div
                                            className="absolute inset-0 w-full h-full bg-cover bg-center"
                                            style={{ backgroundImage: `url(${order.image})`, opacity: 0.8 }}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 text-sm font-medium">
                                            <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
                                            Manual
                                        </div>
                                        <span className="text-xs text-muted-foreground">{order.id}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-muted-foreground">
                                    {order.customer}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium">{order.productName}</span>
                                        {order.configured ? (
                                            <Badge variant="default" className="w-fit bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Configured</Badge>
                                        ) : (
                                            <Badge variant="outline" className="w-fit text-orange-600 border-orange-200 bg-orange-50">Configuration needed</Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{order.sku}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {/* Mock Country Flag */}
                                        <span className="text-lg">
                                            {order.countryCode === 'CA' ? '🇨🇦' : order.countryCode === 'GB' ? '🇬🇧' : '🇺🇸'}
                                        </span>
                                        <span className="text-sm text-muted-foreground">{order.country}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
                                <TableCell className="text-right font-medium pr-4">{order.quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <OrderConfigurationDialog
                open={configDialogOpen}
                onOpenChange={setConfigDialogOpen}
                orderId={configuringOrderId}
                onConfirm={handleConfigurationConfirmed}
            />
        </div>
    );
}
