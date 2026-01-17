"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, FileText } from "lucide-react";
import Image from "next/image";

interface PaymentViewProps {
    amount: number;
}

export function PaymentView({ amount }: PaymentViewProps) {
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [canPayOnAccount, setCanPayOnAccount] = useState(false);

    useEffect(() => {
        // Fetch User Permission (Simulated for User ID 1)
        const fetchPermission = async () => {
            try {
                const response = await fetch('http://localhost:8000/admin/users/1');
                if (response.ok) {
                    const userData = await response.json();
                    if (userData.allow_on_account_payment) {
                        setCanPayOnAccount(true);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user permission", error);
            }
        };
        fetchPermission();
    }, []);

    return (
        <div className="grid gap-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Checkout</h2>
                <p className="text-muted-foreground mt-2">Complete your purchase safely.</p>
            </div>

            <div className="grid md:grid-cols-[1fr_380px] gap-8">
                {/* Payment Methods */}
                <div>
                    <Tabs defaultValue="card" className="w-full" onValueChange={setPaymentMethod}>
                        <TabsList className={`grid w-full h-14 mb-6 ${canPayOnAccount ? 'grid-cols-3' : 'grid-cols-2'}`}>
                            <TabsTrigger value="card" className="h-full gap-2 text-base">
                                <CreditCard className="h-4 w-4" /> Credit Card
                            </TabsTrigger>
                            <TabsTrigger value="paypal" className="h-full gap-2 text-base">
                                <Wallet className="h-4 w-4" /> PayPal
                            </TabsTrigger>
                            {canPayOnAccount && (
                                <TabsTrigger value="account" className="h-full gap-2 text-base">
                                    <FileText className="h-4 w-4" /> Current Account
                                </TabsTrigger>
                            )}
                        </TabsList>

                        {/* Credit Card Form */}
                        <TabsContent value="card">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Credit Card Details</CardTitle>
                                    <CardDescription>Enter your card information to proceed.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Cardholder Name</Label>
                                        <Input placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Card Number</Label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="0000 0000 0000 0000" className="pl-9" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Expiry Date</Label>
                                            <Input placeholder="MM/YY" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>CVC</Label>
                                            <Input placeholder="123" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* PayPal Info */}
                        <TabsContent value="paypal">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pay with PayPal</CardTitle>
                                    <CardDescription>You will be redirected to PayPal to complete your purchase.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                                    <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
                                        {/* Mock PayPal Logo logic simply */}
                                        <span className="font-bold text-blue-600 text-xl font-italic">P</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground max-w-xs">
                                        Connect your PayPal account for a fast and secure checkout experience.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Current Account Info */}
                        <TabsContent value="account">
                            <Card className="border-blue-200 bg-blue-50/30">
                                <CardHeader>
                                    <CardTitle className="text-blue-900">Current Account Payment</CardTitle>
                                    <CardDescription className="text-blue-700">
                                        Place order now and pay later via your agreed payment terms.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-900">Payment on Account</h4>
                                            <p className="text-sm text-slate-500 mt-1">
                                                By proceeding, you confirm that this order will be billed to your current account.
                                                Invoice will be sent to your registered email.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Order Summary Summary (Mini) */}
                <div>
                    <Card className="bg-slate-50 border-slate-200 sticky top-4">
                        <CardHeader>
                            <CardTitle>Payment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Order Total</span>
                                <span className="font-semibold">${amount?.toFixed(2) || "0.00"}</span>
                            </div>
                            <div className="pt-4 border-t">
                                <p className="text-xs text-muted-foreground mb-4">
                                    By clicking "Pay Now", you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
