"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Plus, Info, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function BillingPage() {
    const { toast } = useToast();
    const [paymentMethod, setPaymentMethod] = useState<any>(null);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [newCard, setNewCard] = useState({
        holderName: "",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    useEffect(() => {
        // Load user session on mount
        const session = localStorage.getItem("user_session");
        if (session) {
            try {
                const userData = JSON.parse(session);
                if (userData.paymentMethod) {
                    setPaymentMethod(userData.paymentMethod);
                }
            } catch (e) {
                console.error("Failed to parse user session");
            }
        }
    }, []);

    const handleAddCard = () => {
        // Simple validation
        if (!newCard.cardNumber || !newCard.expiry || !newCard.cvv || !newCard.holderName) {
            toast({ title: "Error", description: "Please fill all card details", variant: "destructive" });
            return;
        }

        // Mock saving card (In reality, send to Stripe/Provider and get token)
        const maskedCard = {
            id: Date.now(),
            brand: "Visa", // Mock detection
            last4: newCard.cardNumber.slice(-4),
            expiry: newCard.expiry,
            holder: newCard.holderName
        };

        setPaymentMethod(maskedCard);
        setIsPaymentDialogOpen(false);
        setNewCard({ holderName: "", cardNumber: "", expiry: "", cvv: "" }); // Reset form

        // Update local storage
        const currentSession = localStorage.getItem("user_session");
        let userData = {};
        if (currentSession) {
            try {
                userData = JSON.parse(currentSession);
            } catch (e) {
                console.error("Failed to parse user session", e);
            }
        }

        const updatedData = {
            ...userData,
            paymentMethod: maskedCard
        };
        localStorage.setItem("user_session", JSON.stringify(updatedData));

        toast({ title: "Card Added", description: `Visa ending in ${maskedCard.last4} attached.` });
    };

    const handleRemoveCard = () => {
        setPaymentMethod(null);

        // Update local storage
        const currentSession = localStorage.getItem("user_session");
        if (currentSession) {
            try {
                const userData = JSON.parse(currentSession);
                const updatedData = {
                    ...userData,
                    paymentMethod: null
                };
                localStorage.setItem("user_session", JSON.stringify(updatedData));
            } catch (e) {
                console.error("Failed to update user session on remove", e);
            }
        }
    };

    return (
        <div className="space-y-10">

            {/* Payment Card Section */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold">Payment Card</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-3xl">
                        Please provide your credit/ debit card. Unless agreed otherwise, you will be charged upon sending an order to production. Please note that we only accept Visa, Mastercard, American Expresss, China UnionPay, Discover & Diners Club, eftpos Australia and Japan Credit Bureau (JCB).
                    </p>
                </div>

                {!paymentMethod ? (
                    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <DialogTrigger asChild>
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group w-full max-w-md h-64">
                                <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 text-slate-500">
                                    <div className="relative">
                                        <CreditCard className="h-8 w-8" />
                                        <Plus className="h-3 w-3 absolute -bottom-1 -right-1 bg-slate-500 text-white rounded-full p-0.5" />
                                    </div>
                                </div>
                                <span className="font-bold text-slate-600 dark:text-slate-400 text-lg">Add a credit/debit card</span>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Payment Method</DialogTitle>
                                <DialogDescription>Enter your card details securely.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="holder">Card Holder Name</Label>
                                    <Input id="holder" placeholder="John Doe" value={newCard.holderName} onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="number">Card Number</Label>
                                    <Input id="number" placeholder="0000 0000 0000 0000" maxLength={19} value={newCard.cardNumber} onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                                        <Input id="expiry" placeholder="MM/YY" maxLength={5} value={newCard.expiry} onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input id="cvv" placeholder="123" maxLength={4} type="password" value={newCard.cvv} onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddCard} className="bg-black text-white hover:bg-slate-800">Add Card</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                ) : (
                    <div className="border border-slate-200 rounded-xl p-6 flex items-center justify-between bg-white shadow-sm max-w-2xl">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-16 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-center">
                                <span className="font-bold text-blue-700 italic">VISA</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Visa ending in {paymentMethod.last4}</h4>
                                <p className="text-sm text-slate-500">Expires {paymentMethod.expiry} • {paymentMethod.holder}</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleRemoveCard}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                        </Button>
                    </div>
                )}
            </section>

            <Separator />

            {/* Invoices Section */}
            <section className="space-y-6">

                {/* No Invoices Banner */}
                <div className="bg-[#FFF8F0] dark:bg-amber-900/10 p-6 rounded-lg flex items-start gap-4">
                    <div className="bg-[#FF6B55] rounded-full p-1 mt-0.5 shrink-0">
                        <Info className="h-4 w-4 text-white" strokeWidth={3} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">No Invoices Generated Yet</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Once an invoice is generated it will appear here. Also this section allows you to make payments for your invoices directly.
                        </p>
                    </div>
                </div>

                <div className="pt-2">
                    <Button size="lg" className="bg-[#FF7D5F] hover:bg-[#FF7D5F]/90 text-white min-w-[200px] h-12 text-base font-semibold shadow-sm">
                        Download Account Statement
                    </Button>
                </div>

            </section>

        </div>
    );
}
