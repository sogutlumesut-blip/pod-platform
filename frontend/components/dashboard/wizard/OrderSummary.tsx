import { RecipientData } from "./RecipientForm";
import { AddressData } from "./AddressForm";
import { ProductData } from "../ProductCalculatorV2";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
    recipient: RecipientData;
    address: AddressData;
    product: ProductData;
}

export function OrderSummary({ recipient, address, product }: OrderSummaryProps) {
    return (
        <div className="max-w-3xl mx-auto space-y-8 py-8">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Review Order</h3>
                <p className="text-muted-foreground">Please review all details before proceeding to payment.</p>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden">
                {/* Product Details */}
                <div className="p-6 space-y-4">
                    <h4 className="font-bold text-lg flex items-center">
                        <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
                        Product Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground block">Dimensions</span>
                            <span className="font-medium">{product.width} x {product.height} {product.unit}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block">Material</span>
                            <span className="font-medium">{product.selectedTexture || '-'}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block">Quantity</span>
                            <span className="font-medium">{product.quantity}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block">Production Method</span>
                            <span className="font-medium capitalize">{product.productionMethod.replace('_', ' ')}</span>
                        </div>
                    </div>
                    {product.note && (
                        <div className="mt-4 pt-4 border-t">
                            <span className="text-muted-foreground block text-sm mb-1">Order Note</span>
                            <p className="text-sm bg-slate-50 p-3 rounded-md italic">{product.note}</p>
                        </div>
                    )}
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Recipient */}
                    <div className="p-6 space-y-4 border-r">
                        <h4 className="font-bold text-lg flex items-center">
                            <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</span>
                            Recipient
                        </h4>
                        <div className="space-y-1 text-sm">
                            <p className="font-medium">{recipient.firstName} {recipient.lastName}</p>
                            <p className="text-muted-foreground">{recipient.email}</p>
                            <p className="text-muted-foreground">{recipient.phone}</p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="p-6 space-y-4">
                        <h4 className="font-bold text-lg flex items-center">
                            <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">3</span>
                            Shipping Address
                        </h4>
                        <div className="space-y-1 text-sm">
                            <p>{address.addressLine1}</p>
                            {address.addressLine2 && <p>{address.addressLine2}</p>}
                            <p>{address.zipCode} {address.district}</p>
                            <p>{address.city}, {address.country.toUpperCase()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
