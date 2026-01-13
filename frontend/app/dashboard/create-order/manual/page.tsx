"use client";

import { WizardStepper } from "@/components/dashboard/WizardStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
// Force rebuild V2
import { ProductCalculatorV2 as ProductCalculator, ProductData } from "@/components/dashboard/ProductCalculatorV2";
import { OrderConfirmationView } from "@/components/dashboard/create-order/OrderConfirmationView";
import { PaymentView } from "@/components/dashboard/create-order/PaymentView";

const STEPS = ["Recipient", "Shipping Address", "Product", "Confirm", "Payment"];

// Common countries list
const COUNTRIES = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Spain", "Italy", "Netherlands", "Turkey"
];

export default function ManualOrderWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoadingZip, setIsLoadingZip] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        recipient: { firstName: '', lastName: '', email: '', phone: '' },
        address: { street: '', street2: '', city: '', state: '', zip: '', country: 'United States' },
        product: {
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
        } as ProductData,
    });

    const nextStep = () => {
        // Validation for Step 3 (Product & Shipping)
        if (currentStep === 3) {
            if (!formData.product.totalPrice) {
                // In reality, show toast
                return;
            }
            if (!formData.product.shippingMethod) {
                // In reality, show toast
                return;
            }
        }
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    };

    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
    const goToStep = (step: number) => setCurrentStep(step);

    const handleAddressChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [field]: value }
        }));
    };

    const handleProductChange = (data: ProductData) => {
        setFormData(prev => ({
            ...prev,
            product: data
        }));
    };

    // Auto-fill logic
    useEffect(() => {
        const { zip, country } = formData.address;
        if (zip.length >= 5 && country === 'United States') {
            const fetchZip = async () => {
                setIsLoadingZip(true);
                try {
                    const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
                    if (response.ok) {
                        const data = await response.json();
                        const place = data.places[0];
                        setFormData(prev => ({
                            ...prev,
                            address: {
                                ...prev.address,
                                city: place['place name'],
                                state: place['state']
                            }
                        }));
                    }
                } catch (error) {
                    console.error("Failed to fetch zip data", error);
                } finally {
                    setIsLoadingZip(false);
                }
            };
            fetchZip();
        }
    }, [formData.address.zip, formData.address.country]);


    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Wizard Header */}
            <div className="border-b px-8 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">Start a new order</h1>
                <Link href="/dashboard/create-order">
                    <X className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                </Link>
            </div>

            {/* Stepper */}
            <div className="border-b bg-muted/10">
                <WizardStepper currentStep={currentStep} steps={STEPS} />
            </div>

            {/* Content Area */}
            <div className="flex-1 container mx-auto max-w-4xl py-12 px-4">

                {/* Step 1: Recipient */}
                {currentStep === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold">Recipient details</h2>
                            <p className="text-muted-foreground">Enter recipient's contact information below</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>NAME *</Label>
                                <Input
                                    value={formData.recipient.firstName}
                                    onChange={(e) => setFormData(getHeader => ({ ...getHeader, recipient: { ...getHeader.recipient, firstName: e.target.value } }))}
                                    placeholder="Recipient's first name" className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>LAST NAME *</Label>
                                <Input
                                    value={formData.recipient.lastName}
                                    onChange={(e) => setFormData(getHeader => ({ ...getHeader, recipient: { ...getHeader.recipient, lastName: e.target.value } }))}
                                    placeholder="Recipient's last name" className="h-12"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>EMAIL *</Label>
                                <Input
                                    value={formData.recipient.email}
                                    onChange={(e) => setFormData(getHeader => ({ ...getHeader, recipient: { ...getHeader.recipient, email: e.target.value } }))}
                                    placeholder="Recipient's email address" className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>PHONE</Label>
                                <Input
                                    value={formData.recipient.phone}
                                    onChange={(e) => setFormData(getHeader => ({ ...getHeader, recipient: { ...getHeader.recipient, phone: e.target.value } }))}
                                    placeholder="Recipient's phone number" className="h-12"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Shipping Address */}
                {currentStep === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold">Shipping Address</h2>
                            <p className="text-muted-foreground">Where should we create and ship this order?</p>
                        </div>

                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <Label>ADDRESS LINE 1 *</Label>
                                <Input
                                    value={formData.address.street}
                                    onChange={(e) => handleAddressChange('street', e.target.value)}
                                    placeholder="Street address"
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>ADDRESS LINE 2</Label>
                                <Input
                                    value={formData.address.street2}
                                    onChange={(e) => handleAddressChange('street2', e.target.value)}
                                    placeholder="Apartment, suite, etc."
                                    className="h-12"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label>ZIP CODE *</Label>
                                    <div className="relative">
                                        <Input
                                            value={formData.address.zip}
                                            onChange={(e) => handleAddressChange('zip', e.target.value)}
                                            placeholder="Zip"
                                            className="h-12"
                                        />
                                        {isLoadingZip && <Loader2 className="absolute right-3 top-3.5 h-5 w-5 animate-spin text-muted-foreground" />}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>CITY *</Label>
                                    <Input
                                        value={formData.address.city}
                                        onChange={(e) => handleAddressChange('city', e.target.value)}
                                        placeholder="City"
                                        className="h-12 bg-muted/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>STATE / PROVINCE *</Label>
                                    <Input
                                        value={formData.address.state}
                                        onChange={(e) => handleAddressChange('state', e.target.value)}
                                        placeholder="State"
                                        className="h-12 bg-muted/20"
                                    />
                                </div>

                            </div>
                            <div className="space-y-2">
                                <Label>COUNTRY *</Label>
                                <Select
                                    value={formData.address.country}
                                    onValueChange={(val) => handleAddressChange('country', val)}
                                >
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COUNTRIES.map(country => (
                                            <SelectItem key={country} value={country}>
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Product Selection */}
                {currentStep === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold">Configure Product</h2>
                            <p className="text-muted-foreground">Enter dimensions, choose material and shipping method.</p>
                        </div>
                        <ProductCalculator
                            data={formData.product}
                            onChange={handleProductChange}
                        />
                    </div>
                )}
                {/* Step 4: Confirm */}
                {currentStep === 4 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <OrderConfirmationView
                            data={formData}
                            onEdit={goToStep}
                        />
                    </div>
                )}

                {/* Step 5: Payment */}
                {currentStep === 5 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <PaymentView amount={formData.product.totalPrice || 0} />
                    </div>
                )}

            </div>

            {/* Footer Actions */}
            <div className="border-t p-6 bg-background">
                <div className="container mx-auto max-w-4xl flex items-center justify-end gap-4">
                    <Button variant="outline" size="lg" className="h-12 w-32" disabled={currentStep === 1} onClick={prevStep}>
                        Back
                    </Button>
                    {currentStep === 5 ? (
                        <Button size="lg" className="h-12 w-48 bg-[#FF6B55] hover:bg-[#FF6B55]/90">
                            Pay ${formData.product.totalPrice?.toFixed(2) || "0.00"}
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            className="h-12 w-32 bg-[#FF6B55] hover:bg-[#FF6B55]/90"
                            onClick={nextStep}
                            disabled={(currentStep === 3 && !formData.product.shippingMethod)}
                        >
                            {currentStep === STEPS.length ? "Finish" : "Next"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
