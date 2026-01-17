"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Search, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Define the texture types properly to match ProductCalculatorWizard
const TEXTURES = [
    { id: 'non-woven', name: 'Non-Woven', defaultPrice: 11 },
    { id: 'textured', name: 'Textured', defaultPrice: 13 },
    { id: 'peel-stick', name: 'Peel & Stick', defaultPrice: 14 },
    { id: 'deluxe-textile', name: 'Deluxe Textile', defaultPrice: 15 },
    { id: 'canvas-peel-stick', name: 'Canvas Peel & Stick', defaultPrice: 18 },
];

interface User {
    id: number;
    full_name: string;
    discount_percentage: number;
    custom_pricing_json: string | null;
    allow_on_account_payment?: boolean;
}

interface CustomerPricingDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CustomerPricingDialog({ user, open, onOpenChange }: CustomerPricingDialogProps) {
    const [loading, setLoading] = useState(false);
    const [discount, setDiscount] = useState<string>('0');
    const [allowOnAccount, setAllowOnAccount] = useState(false);
    const [prices, setPrices] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            setDiscount(user.discount_percentage.toString());
            setAllowOnAccount(!!user.allow_on_account_payment);
            try {
                const parsedPrices = user.custom_pricing_json ? JSON.parse(user.custom_pricing_json) : {};
                const initialPrices: Record<string, string> = {};
                TEXTURES.forEach(t => {
                    initialPrices[t.id] = parsedPrices[t.id] ? parsedPrices[t.id].toString() : '';
                });
                setPrices(initialPrices);
            } catch (e) {
                console.error("Failed to parse pricing JSON", e);
                setPrices({});
            }
        }
    }, [user, open]);

    // Need to cast user to any or update interface locally to avoid TS error until I update interface
    // actually I should update interface first. using 'any' for speed or update the interface above.
    // I will update interface in next block.

    const handlePriceChange = (id: string, value: string) => {
        setPrices(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const customPricingToSave: Record<string, number> = {};
            let hasCustomPrices = false;

            Object.entries(prices).forEach(([id, priceStr]) => {
                const price = parseFloat(priceStr);
                if (!isNaN(price) && price >= 0) {
                    customPricingToSave[id] = price;
                    hasCustomPrices = true;
                }
            });

            const payload = {
                discount_percentage: parseFloat(discount) || 0,
                custom_pricing_json: hasCustomPrices ? JSON.stringify(customPricingToSave) : null,
                allow_on_account_payment: allowOnAccount
            };

            const response = await fetch(`http://localhost:8000/admin/users/${user.id}/pricing`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast({
                    title: "Pricing Updated",
                    description: `Custom pricing for ${user.full_name} has been saved.`
                });
                onOpenChange(false);
            } else {
                throw new Error("Failed to update");
            }

        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save pricing configuration.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Pricing: {user.full_name}</DialogTitle>
                    <DialogDescription>
                        Set custom unit prices or a global discount for this customer.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Payment Permissions */}
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">Allow "Current Account"</Label>
                            <div className="text-sm text-muted-foreground">
                                Enable paying on account (Cari Hesap) without immediate payment.
                            </div>
                        </div>
                        <Switch
                            checked={allowOnAccount}
                            onCheckedChange={setAllowOnAccount}
                        />
                    </div>

                    <Separator />

                    {/* Global Discount */}
                    <div className="grid w-full items-center gap-1.5 bg-slate-50 p-4 rounded-lg border">
                        <Label htmlFor="discount" className="font-semibold">Global Discount Percentage (%)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="discount"
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                className="max-w-[120px]"
                                min="0"
                                max="100"
                            />
                            <span className="text-muted-foreground text-sm">Applied to total order amount</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Unit Price Overrides */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Unit Price Overrides (Per m²)</h4>
                        <div className="grid gap-3">
                            {TEXTURES.map((texture) => (
                                <div key={texture.id} className="grid grid-cols-[1fr_120px] items-center gap-4">
                                    <Label htmlFor={`price-${texture.id}`} className="text-sm">
                                        {texture.name} <span className="text-muted-foreground font-normal">(Default: ${texture.defaultPrice})</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-500 text-sm">$</span>
                                        <Input
                                            id={`price-${texture.id}`}
                                            type="number"
                                            placeholder={texture.defaultPrice.toString()}
                                            value={prices[texture.id] || ''}
                                            onChange={(e) => handlePriceChange(texture.id, e.target.value)}
                                            className="pl-6 h-9"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
