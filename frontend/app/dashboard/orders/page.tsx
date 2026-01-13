import { OrdersTable } from "@/components/dashboard/OrdersTable";

export default function OrdersPage() {
    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            </div>
            <OrdersTable />
        </div>
    );
}
