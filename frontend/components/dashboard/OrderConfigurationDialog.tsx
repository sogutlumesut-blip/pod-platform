"use client";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductData } from "@/components/dashboard/ProductCalculatorV2";
import { ProductCalculatorWizard } from "./wizard/ProductCalculatorWizard";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";
import { WizardStepper } from "./WizardStepper";
import { RecipientForm, RecipientData } from "./wizard/RecipientForm";
import { AddressForm, AddressData } from "./wizard/AddressForm";
import { OrderSummary } from "./wizard/OrderSummary";

interface OrderConfigurationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentOrderId?: string;
    onConfirm: (orderData: any) => void;
}

const STEPS = ["Recipient", "Address", "Product", "Confirm", "Payment"];

export function OrderConfigurationDialog({
    open,
    onOpenChange,
    currentOrderId,
    onConfirm,
}: OrderConfigurationDialogProps) {

    const [step, setStep] = useState(1);

    // Form States
    const [recipient, setRecipient] = useState<RecipientData>({
        firstName: "", lastName: "", email: "", phone: ""
    });
    const [address, setAddress] = useState<AddressData>({
        country: "", city: "", district: "", zipCode: "", addressLine1: "", addressLine2: ""
    });
    const [product, setProduct] = useState<ProductData>({
        stockCode: "", width: "", height: "", quantity: "1", selectedTexture: "", unit: "CM", totalPrice: null, selectedImage: null, shippingMethod: null, shippingCost: 0, productionMethod: 'upload', productionExternalUrl: '', note: ''
    });
    const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal'>('credit_card');

    const handleNext = () => {
        if (step < 5) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleConfirm = () => {
        const fullOrderData = {
            recipient,
            address,
            product,
            paymentMethod,
            status: 'paid'
        };
        console.log("Submitting Order:", fullOrderData);
        onConfirm(fullOrderData);
        onOpenChange(false);
        // Reset state slightly after close
        setTimeout(() => setStep(1), 500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] w-full h-[95vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-50">

                {/* Header with Stepper */}
                <div className="bg-white border-b shrink-0 z-10 px-6 pt-6 pb-2">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl text-center">Create New Order</DialogTitle>
                    </DialogHeader>
                    <WizardStepper currentStep={step} steps={STEPS} />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-4xl mx-auto w-full">
                        {step === 1 && (
                            <div className="bg-white p-8 rounded-xl border shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                                <RecipientForm data={recipient} onChange={setRecipient} />
                            </div>
                        )}
                        {step === 2 && (
                            <div className="bg-white p-8 rounded-xl border shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                                <AddressForm data={address} onChange={setAddress} />
                            </div>
                        )}
                        {step === 3 && (
                            <div className="bg-white p-8 rounded-xl border shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                                <ProductCalculatorWizard data={product} onChange={setProduct} />
                            </div>
                        )}
                        {step === 4 && (
                            <div className="bg-white p-8 rounded-xl border shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                                <OrderSummary recipient={recipient} address={address} product={product} />
                            </div>
                        )}
                        {step === 5 && (
                            <div className="bg-white p-8 rounded-xl border shadow-sm animate-in fade-in slide-in-from-right-4 duration-300 max-w-2xl mx-auto">
                                <div className="text-center space-y-2 mb-8">
                                    <h3 className="text-2xl font-bold">Select Payment Method</h3>
                                    <p className="text-muted-foreground">Securely complete your order</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {/* Stripe / Credit Card Method */}
                                    <div
                                        className={`border-2 rounded-xl p-6 cursor-pointer hover:border-black transition-all ${paymentMethod === 'credit_card' ? 'border-black bg-slate-50' : 'border-slate-200'}`}
                                        onClick={() => setPaymentMethod('credit_card')}
                                    >
                                        <div className="h-12 w-12 bg-white rounded-full border flex items-center justify-center mb-4 mx-auto">
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="font-bold">Credit Card</h4>
                                            <p className="text-xs text-muted-foreground mt-1">Stripe Secure</p>
                                        </div>
                                    </div>

                                    {/* PayPal Method */}
                                    <div
                                        className={`border-2 rounded-xl p-6 cursor-pointer hover:border-black transition-all ${paymentMethod === 'paypal' ? 'border-black bg-slate-50' : 'border-slate-200'}`}
                                        onClick={() => setPaymentMethod('paypal')}
                                    >
                                        <div className="h-12 w-12 bg-[#003087] rounded-full flex items-center justify-center mb-4 text-white font-bold italic mx-auto">
                                            P
                                        </div>
                                        <div className="text-center">
                                            <h4 className="font-bold">PayPal</h4>
                                            <p className="text-xs text-muted-foreground mt-1">PayPal Wallet</p>
                                        </div>
                                    </div>
                                </div>

                                {paymentMethod === 'credit_card' && (
                                    <div className="space-y-4 border-t pt-6">
                                        <div className="space-y-2">
                                            <Label>Card Number</Label>
                                            <Input placeholder="0000 0000 0000 0000" className="h-11" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Expiry</Label>
                                                <Input placeholder="MM/YY" className="h-11" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>CVC</Label>
                                                <Input placeholder="123" className="h-11" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <DialogFooter className="p-6 border-t shrink-0 bg-white z-10 flex justify-between sm:justify-between w-full">
                    <Button variant="outline" size="lg" className="px-8" onClick={step === 1 ? () => onOpenChange(false) : handleBack}>
                        {step === 1 ? 'Cancel' : 'Back'}
                    </Button>

                    {step < 5 ? (
                        <Button size="lg" className="px-8 bg-black text-white hover:bg-slate-800" onClick={handleNext}>
                            Next Step
                        </Button>
                    ) : (
                        <Button size="lg" className="px-8 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200" onClick={handleConfirm}>
                            Pay & Complete Order
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
