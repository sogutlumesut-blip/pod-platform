"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductCalculatorV2, ProductData } from "@/components/dashboard/ProductCalculatorV2";
import { useState } from "react";

interface OrderConfigurationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderId: string | null;
    onConfirm: () => void;
}

export function OrderConfigurationDialog({
    open,
    onOpenChange,
    orderId,
    onConfirm,
}: OrderConfigurationDialogProps) {

    const [data, setData] = useState<ProductData>({
        stockCode: "",
        width: "",
        height: "",
        quantity: "1",
        selectedTexture: "",
        unit: "CM",
        totalPrice: null,
        selectedImage: null,
        shippingMethod: null,
        shippingCost: 0,
        productionMethod: 'upload',
        productionExternalUrl: ''
    });

    const handleSave = () => {
        // In a real app, this would gather state from the calculator
        console.log("Saving configuration:", data);
        onConfirm();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] w-full h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 border-b shrink-0 bg-background z-10">
                    <DialogTitle className="text-2xl">Configure Order #{orderId}</DialogTitle>
                    <DialogDescription className="text-base mt-2">
                        Enter the custom dimensions and select the material for this order.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-auto p-4 md:p-5 bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="w-full">
                        <ProductCalculatorV2 data={data} onChange={setData} />
                    </div>
                </div>

                <DialogFooter className="p-6 border-t shrink-0 bg-background z-10">
                    <Button variant="outline" size="lg" className="text-base px-8" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button size="lg" className="text-base px-8" onClick={handleSave}>Save Configuration</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
