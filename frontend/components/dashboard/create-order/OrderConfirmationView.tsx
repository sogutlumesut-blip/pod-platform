"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MapPin, User, FileText, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderConfirmationViewProps {
    data: any; // Using any for simplicity in prototype, should be typed
    onEdit: (step: number) => void;
}

export function OrderConfirmationView({ data, onEdit }: OrderConfirmationViewProps) {
    const { recipient, address, product } = data;

    // Helper to get texture name (mock logic matching calculator)
    const getTextureName = (id: string) => {
        const textures: Record<string, string> = {
            "t1": "Non-Woven Wallpaper",
            "t2": "Textured Vinyl",
            "t3": "Peel & Stick",
            "t4": "Canvas Fabric",
        };
        return textures[id] || "Standard Material";
    };

    return (
        <div className="grid gap-6">
            <h2 className="text-3xl font-bold">Review Order</h2>
            <div className="grid md:grid-cols-[2fr_1fr] gap-6">

                {/* Left Column: Details */}
                <div className="space-y-6">
                    {/* Product Summary */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Product Details</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
                                <Edit2 className="h-4 w-4 mr-2" /> Edit
                            </Button>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex gap-4">
                                <div className="relative h-24 w-24 bg-slate-100 rounded-md overflow-hidden border">
                                    {product.selectedImage ? (
                                        <Image src={product.selectedImage} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No Image</div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold">{product.stockCode || "Custom Order"}</h4>
                                    <p className="text-sm text-muted-foreground">{getTextureName(product.selectedTexture)}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="outline">{product.width} x {product.height} {product.unit}</Badge>
                                        <Badge variant="secondary">Qty: {product.quantity}</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping & Recipient */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <User className="h-4 w-4" /> Recipient
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="h-8" onClick={() => onEdit(1)}>
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                            </CardHeader>
                            <CardContent className="text-sm space-y-1">
                                <p className="font-medium">{recipient.firstName} {recipient.lastName}</p>
                                <p>{recipient.email}</p>
                                <p>{recipient.phone}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Shipping To
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="h-8" onClick={() => onEdit(2)}>
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                            </CardHeader>
                            <CardContent className="text-sm space-y-1">
                                <p>{address.street}</p>
                                {address.street2 && <p>{address.street2}</p>}
                                <p>{address.city}, {address.state} {address.zip}</p>
                                <p>{address.country}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Price Summary */}
                <div className="space-y-6">
                    <Card className="bg-slate-50 border-slate-200">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${((product.totalPrice || 0) - (product.shippingCost || 0)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping ({product.shippingMethod || "Pending"})</span>
                                <span className="text-green-600 font-medium">
                                    {(product.shippingCost || 0) > 0 ? `$${product.shippingCost.toFixed(2)}` : "Free"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Sample Request</span>
                                <span>$0.00</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-bold text-xl text-[#FF6B55]">
                                    ${(product.totalPrice || 0).toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
