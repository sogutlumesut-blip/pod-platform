"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, Calculator, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Mock Data for Textures
// Mock Data for Textures
const TEXTURES = [
    { id: "t1", name: "Non-Woven", pricePerSqm: 11, image: "/placeholder-texture-1.jpg" },
    { id: "t2", name: "Textured", pricePerSqm: 13, image: "/placeholder-texture-2.jpg" },
    { id: "t3", name: "Peel & Stick", pricePerSqm: 14, image: "/placeholder-texture-3.jpg" },
    { id: "t4", name: "Deluxe Textile", pricePerSqm: 15, image: "/placeholder-texture-4.jpg" },
    { id: "t5", name: "Canvas Peel & Stick", pricePerSqm: 18, image: "/placeholder-texture-4.jpg" },
];

const SHIPPING_METHODS = [
    { id: 'economy', name: 'Economy (5-12 days)', basePrice: 10, perSqm: 2 },
    { id: 'standard', name: 'Standard (3-7 days)', basePrice: 15, perSqm: 5 },
    { id: 'express', name: 'Express (1-3 days)', basePrice: 25, perSqm: 10 },
];

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link as LinkIcon } from "lucide-react";

export interface ProductData {
    stockCode: string;
    width: string;
    height: string;
    quantity: string;
    selectedTexture: string;
    unit: string;
    totalPrice: number | null;
    selectedImage: string | null;
    shippingMethod: string | null;
    shippingCost: number;
    productionMethod: 'upload' | 'link';
    productionExternalUrl: string;
    note?: string;
}

interface ProductCalculatorProps {
    data: ProductData;
    onChange: (data: ProductData) => void;
}

export function ProductCalculatorV2({ data, onChange }: ProductCalculatorProps) {
    // Destructure for easier access
    const {
        stockCode, width, height, quantity, selectedTexture, unit,
        totalPrice, selectedImage, shippingMethod, shippingCost,
        productionMethod = 'upload', productionExternalUrl = ''
    } = data;

    // We can keep fileInputRef local as it's UI concern
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper to update a single field
    const updateField = (field: keyof ProductData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    // ... (Calculate Price Effect - Unchanged)
    useEffect(() => {
        const w = parseFloat(width);
        const h = parseFloat(height);
        const q = parseInt(quantity);
        const texture = TEXTURES.find(t => t.id === selectedTexture);
        const shipping = SHIPPING_METHODS.find(s => s.id === shippingMethod);

        if (w && h && q && texture) {
            let area = 0;
            if (unit === "CM") {
                area = (w / 100) * (h / 100);
            } else {
                area = (w * 0.0254) * (h * 0.0254);
            }

            const productPrice = area * texture.pricePerSqm * q;

            let currentShippingCost = 0;
            if (shipping) {
                currentShippingCost = shipping.basePrice + (shipping.perSqm * area * q);
            }

            const finalPrice = parseFloat((productPrice + currentShippingCost).toFixed(2));

            if (totalPrice !== finalPrice || shippingCost !== parseFloat(currentShippingCost.toFixed(2))) {
                onChange({
                    ...data,
                    totalPrice: finalPrice,
                    shippingCost: parseFloat(currentShippingCost.toFixed(2))
                });
            }
        } else {
            if (totalPrice !== null) updateField('totalPrice', null);
        }
    }, [width, height, quantity, selectedTexture, unit, shippingMethod]);

    // ... (Handlers)
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            updateField('selectedImage', imageUrl);
        }
    };

    const clearImage = () => {
        updateField('selectedImage', null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="bg-background rounded-xl border shadow-sm flex flex-col h-full animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-slate-50/50 dark:bg-slate-900/50 px-5 py-4 border-b flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Calculator className="h-4 w-4" />
                </div>
                <div>
                    <h3 className="font-bold text-lg leading-none">Custom Size Calculator</h3>
                    <p className="text-xs text-muted-foreground mt-1">Configure your custom wallpaper order</p>
                </div>
            </div>

            <div className="p-5 grid gap-5 flex-1">
                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

                    {/* Left Column: Form Fields */}
                    <div className="space-y-6">
                        {/* Row 1: Stock Code & Unit */}
                        <div className="grid grid-cols-[1.5fr_1fr] gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-muted-foreground">Stock Code</Label>
                                <Input
                                    value={stockCode}
                                    onChange={(e) => updateField('stockCode', e.target.value)}
                                    placeholder="WL-204"
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-muted-foreground">Unit</Label>
                                <Select value={unit} onValueChange={(val) => updateField('unit', val)}>
                                    <SelectTrigger className="h-10 text-sm truncate">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CM">Centimeters (CM)</SelectItem>
                                        <SelectItem value="IN">Inches (IN)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Row 2: Dimensions */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-muted-foreground">Width</Label>
                                <Input
                                    value={width}
                                    onChange={(e) => updateField('width', e.target.value)}
                                    type="number"
                                    placeholder="0.00"
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-muted-foreground">Height</Label>
                                <Input
                                    value={height}
                                    onChange={(e) => updateField('height', e.target.value)}
                                    type="number"
                                    placeholder="0.00"
                                    className="h-10 text-sm"
                                />
                            </div>
                        </div>

                        {/* Row 3: Material & Quantity */}
                        <div className="grid grid-cols-[1fr_100px] gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-muted-foreground">Material / Texture</Label>
                                <Select value={selectedTexture} onValueChange={(val) => updateField('selectedTexture', val)}>
                                    <SelectTrigger className="h-10 w-full text-sm">
                                        <SelectValue placeholder="Select Material" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TEXTURES.map((texture) => (
                                            <SelectItem key={texture.id} value={texture.id} className="py-2">
                                                <div className="flex items-center justify-between w-full min-w-[200px] gap-4">
                                                    <span className="text-sm">{texture.name}</span>
                                                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">${texture.pricePerSqm}/m²</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-muted-foreground">Quantity</Label>
                                <Input
                                    value={quantity}
                                    onChange={(e) => updateField('quantity', e.target.value)}
                                    type="number"
                                    min="1"
                                    className="h-10 text-sm text-center"
                                    placeholder="1"
                                />
                            </div>
                        </div>

                        {/* Row 4: Shipping Method */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-red-600">Shipping Method *</Label>
                            <Select value={shippingMethod || ""} onValueChange={(val) => updateField('shippingMethod', val)}>
                                <SelectTrigger className="h-10 w-full text-sm border-red-100 bg-red-50/50 focus:ring-red-200">
                                    <SelectValue placeholder="Select shipping method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SHIPPING_METHODS.map((method) => (
                                        <SelectItem key={method.id} value={method.id} className="py-2">
                                            <div className="flex items-center justify-between w-full min-w-[200px] gap-4">
                                                <span className="text-sm font-medium">{method.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Right Column: Production File Selection */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-semibold text-muted-foreground">Production File</Label>

                        <div className="border rounded-lg p-1 bg-muted/20">
                            <Tabs value={productionMethod} onValueChange={(v: any) => updateField('productionMethod', v)} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                                    <TabsTrigger value="link">External Link</TabsTrigger>
                                </TabsList>

                                <TabsContent value="upload" className="mt-0">
                                    <div onClick={() => !selectedImage && fileInputRef.current?.click()} className={cn(
                                        "relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all duration-200 group w-full h-[200px] bg-slate-50 hover:bg-slate-100 cursor-pointer overflow-hidden",
                                        selectedImage ? "border-solid border-slate-200 p-0" : "border-slate-300 p-4"
                                    )}>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />

                                        {selectedImage ? (
                                            <>
                                                <div className="relative w-full h-full">
                                                    <Image src={selectedImage} alt="Preview" fill className="object-cover" />
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-md z-10"
                                                    onClick={(e) => { e.stopPropagation(); clearImage(); }}
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="text-center space-y-2">
                                                <div className="mx-auto h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Upload className="h-5 w-5 text-slate-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">Click to upload</p>
                                                    <p className="text-xs text-slate-400">max. 100MB</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="link" className="mt-0">
                                    <div className="bg-slate-50 border rounded-lg h-[200px] flex flex-col justify-center p-4 space-y-4">
                                        <div className="text-center">
                                            <div className="mx-auto h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                                                <LinkIcon className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700">File Link</p>
                                            <p className="text-xs text-slate-400 mb-4">Paste WeTransfer, Drive, or Dropbox link</p>
                                        </div>
                                        <Input
                                            placeholder="https://"
                                            value={productionExternalUrl}
                                            onChange={(e) => updateField('productionExternalUrl', e.target.value)}
                                            className="bg-white"
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>

                {/* Footer: Price Display (Compact) */}
                <div className="mt-2 p-4 bg-slate-900 text-white rounded-lg flex items-center justify-between shadow-md">
                    <div className="space-y-0.5">
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Price (Inc. Shipping)</div>
                        <div className="text-xs text-slate-400 truncate max-w-[200px]">
                            {shippingCost > 0 ? `Shipping: $${shippingCost.toFixed(2)}` : 'Shipping pending'}
                        </div>
                    </div>
                    <div className="text-2xl font-bold tracking-tight">
                        {totalPrice !== null ? "$" + totalPrice.toFixed(2) : "$0.00"}
                    </div>
                </div>
            </div>
        </div>
    );
}
