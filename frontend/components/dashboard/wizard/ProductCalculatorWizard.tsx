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
import { Upload, X, Link as LinkIcon } from "lucide-react"; // Removed unnecessary icons
import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ProductData } from "@/components/dashboard/ProductCalculatorV2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import mock data if shared, or copy for now
// Ideally, move constants to a shared file
const TEXTURES = [
    { id: "t1", name: "Non-Woven", pricePerSqm: 11 },
    { id: "t2", name: "Textured", pricePerSqm: 13 },
    { id: "t3", name: "Peel & Stick", pricePerSqm: 14 },
    { id: "t4", name: "Deluxe Textile", pricePerSqm: 15 },
    { id: "t5", name: "Canvas Peel & Stick", pricePerSqm: 18 },
];

const SHIPPING_METHODS = [
    { id: 'economy', name: 'Economy (5-12 days)', basePrice: 10, perSqm: 2 },
    { id: 'standard', name: 'Standard (3-7 days)', basePrice: 15, perSqm: 5 },
    { id: 'express', name: 'Express (1-3 days)', basePrice: 25, perSqm: 10 },
];

interface ProductCalculatorWizardProps {
    data: ProductData;
    onChange: (data: ProductData) => void;
}

export function ProductCalculatorWizard({ data, onChange }: ProductCalculatorWizardProps) {
    const {
        stockCode, width, height, quantity, selectedTexture, unit,
        totalPrice, selectedImage, shippingMethod, shippingCost,
        productionMethod = 'upload', productionExternalUrl = ''
    } = data;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [customPricing, setCustomPricing] = useState<Record<string, number> | null>(null);
    const [discountDetails, setDiscountDetails] = useState<{ percentage: number } | null>(null);

    // Fetch User Pricing (Simulated for User ID 1)
    useEffect(() => {
        const fetchUserPricing = async () => {
            try {
                // In a real app, this would be /api/me or derived from session
                const response = await fetch('http://localhost:8000/admin/users/1');
                if (response.ok) {
                    const userData = await response.json();
                    if (userData.custom_pricing_json) {
                        try {
                            setCustomPricing(JSON.parse(userData.custom_pricing_json));
                        } catch (e) {
                            console.error("Error parsing price JSON", e);
                        }
                    }
                    if (userData.discount_percentage > 0) {
                        setDiscountDetails({ percentage: userData.discount_percentage });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user pricing", error);
            }
        };
        fetchUserPricing();
    }, []);

    const updateField = (field: keyof ProductData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    // Recalculate Logic
    const calculateTotalPrice = useCallback(() => {
        const w = parseFloat(width);
        const h = parseFloat(height);
        const q = parseInt(quantity);

        let texturePrice = TEXTURES.find(t => t.id === selectedTexture)?.pricePerSqm || 0;

        // Apply Custom Price Override
        if (customPricing && customPricing[selectedTexture]) {
            texturePrice = customPricing[selectedTexture];
        }

        const shipping = SHIPPING_METHODS.find(s => s.id === shippingMethod);

        if (w && h && q && selectedTexture) {
            let area = 0;
            if (unit === "CM") {
                area = (w / 100) * (h / 100);
            } else {
                area = (w * 0.0254) * (h * 0.0254);
            }

            let basePrice = area * texturePrice * q;

            // Apply Discount
            if (discountDetails?.percentage) {
                basePrice = basePrice * (1 - discountDetails.percentage / 100);
            }

            let currentShippingCost = 0;
            if (shipping) {
                currentShippingCost = shipping.basePrice + (shipping.perSqm * area * q);
            }

            const finalPrice = parseFloat((basePrice + currentShippingCost).toFixed(2));

            if (totalPrice !== finalPrice || shippingCost !== parseFloat(currentShippingCost.toFixed(2))) {
                onChange({
                    ...data,
                    totalPrice: finalPrice,
                    shippingCost: parseFloat(currentShippingCost.toFixed(2))
                });
            }
        }
    }, [width, height, quantity, selectedTexture, unit, shippingMethod, customPricing, discountDetails, onChange, data, totalPrice, shippingCost]);

    useEffect(() => {
        calculateTotalPrice();
    }, [calculateTotalPrice]);



    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            updateField('selectedImage', imageUrl);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Product Configuration</h3>
                <p className="text-muted-foreground">Customize your product specifications</p>
            </div>

            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">

                {/* Row: External URL */}
                <div className="grid grid-cols-[180px_1fr] border-b">
                    <div className="bg-slate-50 p-4 flex items-center text-sm font-medium text-slate-700">
                        External URL
                    </div>
                    <div className="p-3">
                        <Input
                            placeholder="https://"
                            value={productionExternalUrl || ''}
                            onChange={(e) => {
                                updateField('productionExternalUrl', e.target.value);
                                updateField('productionMethod', 'link');
                            }}
                            className="h-10 border-slate-200"
                        />
                    </div>
                </div>

                {/* Row: Upload File */}
                <div className="grid grid-cols-[180px_1fr] border-b">
                    <div className="bg-slate-50 p-4 flex items-center text-sm font-medium text-slate-700">
                        Upload File
                    </div>
                    <div className="p-3">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium h-10 px-4 rounded-md flex items-center justify-center cursor-pointer transition-colors"
                        >
                            {selectedImage ? 'Change File / Image' : 'UPLOAD IMAGE / FILE'}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={(e) => { handleImageUpload(e); updateField('productionMethod', 'upload'); }} accept="image/*" className="hidden" />

                        {selectedImage && (
                            <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border">
                                <Image src={selectedImage} alt="Preview" fill className="object-cover" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                    onClick={(e) => { e.stopPropagation(); updateField('selectedImage', null) }}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Row: Unit */}
                <div className="grid grid-cols-[180px_1fr] border-b">
                    <div className="bg-slate-50 p-4 flex items-center text-sm font-medium text-slate-700">
                        Unit
                    </div>
                    <div className="p-3">
                        <Select value={unit} onValueChange={(val) => updateField('unit', val)}>
                            <SelectTrigger className="h-10 border-slate-200 bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CM">Centimeters (CM)</SelectItem>
                                <SelectItem value="IN">Inches (IN)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Row: Dimensions */}
                <div className="grid grid-cols-[180px_1fr] border-b">
                    <div className="bg-slate-50 p-4 flex items-center text-sm font-medium text-slate-700">
                        Dimensions
                    </div>
                    <div className="p-3 flex items-center gap-4">
                        <Input
                            type="number"
                            value={width}
                            onChange={(e) => updateField('width', e.target.value)}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Width"
                            className="h-10 border-slate-200 text-center no-spinner"
                        />
                        <span className="text-slate-400 font-medium">x</span>
                        <Input
                            type="number"
                            value={height}
                            onChange={(e) => updateField('height', e.target.value)}
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Height"
                            className="h-10 border-slate-200 text-center no-spinner"
                        />
                    </div>
                </div>

                {/* Row: Quantity */}
                <div className="grid grid-cols-[180px_1fr] border-b">
                    <div className="bg-slate-50 p-4 flex items-center text-sm font-medium text-slate-700">
                        Quantity
                    </div>
                    <div className="p-3">
                        <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => updateField('quantity', e.target.value)}
                            onWheel={(e) => e.currentTarget.blur()}
                            className="h-10 border-slate-200 no-spinner"
                        />
                    </div>
                </div>

                {/* Row: Material */}
                <div className="grid grid-cols-[180px_1fr] border-b">
                    <div className="bg-slate-50 p-4 flex items-center text-sm font-medium text-slate-700">
                        Material
                    </div>
                    <div className="p-3">
                        <Select value={selectedTexture} onValueChange={(val) => updateField('selectedTexture', val)}>
                            <SelectTrigger className="h-10 border-slate-200 bg-white">
                                <SelectValue placeholder="Select Material" />
                            </SelectTrigger>
                            <SelectContent>
                                {TEXTURES.map((t) => {
                                    const price = customPricing && customPricing[t.id] ? customPricing[t.id] : t.pricePerSqm;
                                    const isCustom = customPricing && customPricing[t.id];
                                    return (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.name} (${price}/m²) {isCustom && <span className="text-xs text-green-600 font-bold ml-1">*Special</span>}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Row: Shipping */}
                <div className="grid grid-cols-[180px_1fr] border-b">
                    <div className="bg-slate-50 p-4 flex items-center text-sm font-medium text-slate-700">
                        Shipping
                    </div>
                    <div className="p-3">
                        <Select value={shippingMethod || ""} onValueChange={(val) => updateField('shippingMethod', val)}>
                            <SelectTrigger className="h-10 bg-red-50/50 border-red-100 focus:ring-red-200">
                                <SelectValue placeholder="Select shipping option" />
                            </SelectTrigger>
                            <SelectContent>
                                {SHIPPING_METHODS.map((m) => (
                                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Row: Note */}
                <div className="grid grid-cols-[180px_1fr]">
                    <div className="bg-slate-50 p-4 flex items-start pt-6 text-sm font-medium text-slate-700">
                        Order Note
                    </div>
                    <div className="p-3">
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            placeholder="Optional instructions..."
                            value={data.note || ''}
                            onChange={(e) => updateField('note', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Total Footer */}
            <div className="bg-slate-900 text-white p-5 rounded-xl flex items-center justify-between shadow-lg">
                <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Total Summary</p>
                    <p className="text-sm text-slate-300">
                        {width && height && quantity ? `${quantity} items • ${width}x${height} ${unit}` : 'Enter details'}
                        {shippingCost > 0 && ` • +$${shippingCost} Shipping`}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Total Price</p>
                    <div className="text-3xl font-bold">
                        ${totalPrice ? totalPrice.toFixed(2) : '0.00'}
                    </div>
                </div>
            </div>
        </div>
    );
}
