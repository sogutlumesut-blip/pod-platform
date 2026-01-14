"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Plus, Trash2, CheckCircle2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function SettingsPage() {
    const { toast } = useToast();
    const [countryCode, setCountryCode] = useState("+1");

    // Form State
    const [formData, setFormData] = useState({
        storeName: "",
        fullName: "",
        email: "",
        phone: "",
        storeNamePersistent: "" // To track if store name is actually saved
    });

    // Billing State
    const [billingData, setBillingData] = useState({
        country: "",
        state: "",
        city: "",
        zip: "",
        address1: "",
        address2: ""
    });

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<any>(null);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [newCard, setNewCard] = useState({
        holderName: "",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    // Validates if the "Account Setup" is complete
    const isSetupComplete = () => {
        return (
            formData.storeName &&
            formData.fullName &&
            formData.phone &&
            billingData.country &&
            billingData.address1 &&
            billingData.city &&
            billingData.zip &&
            paymentMethod
        );
    };

    useEffect(() => {
        // Load user session on mount
        const session = localStorage.getItem("user_session");
        if (session) {
            try {
                const userData = JSON.parse(session);

                // Load basic info
                setFormData(prev => ({
                    ...prev,
                    fullName: userData.name || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    storeName: userData.storeName || "",
                    storeNamePersistent: userData.storeName || ""
                }));

                // Load Billing Info if exists
                if (userData.billing) {
                    setBillingData(userData.billing);
                }

                // Load Payment Method if exists
                if (userData.paymentMethod) {
                    setPaymentMethod(userData.paymentMethod);
                }

                // Load saved country code or default to +1
                if (userData.countryCode) {
                    setCountryCode(userData.countryCode);
                }
            } catch (e) {
                console.error("Failed to parse user session");
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setBillingData(prev => ({ ...prev, [id]: value }));
    };

    const handleBillingSelectChange = (field: string, value: string) => {
        setBillingData(prev => ({ ...prev, [field]: value }));
    };

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

        toast({ title: "Card Added", description: `Visa ending in ${maskedCard.last4} attached.` });
    };

    const handleRemoveCard = () => {
        setPaymentMethod(null);
    };

    const handleSave = () => {
        // Validation: Check if everything is filled
        if (!isSetupComplete()) {
            toast({
                title: "Incomplete Setup",
                description: "Please fill in all Contact, Billing, and Payment details to complete your account setup.",
                variant: "destructive"
            });
            return;
        }

        // Update local storage
        const currentSession = localStorage.getItem("user_session");
        if (currentSession) {
            const userData = JSON.parse(currentSession);
            const updatedData = {
                ...userData,
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                countryCode: countryCode,
                storeName: formData.storeName,
                billing: billingData,
                paymentMethod: paymentMethod,
                isAccountSetupComplete: true // Flag for Dashboard
            };
            localStorage.setItem("user_session", JSON.stringify(updatedData));

            toast({
                title: "Membership Completed! 🎉",
                description: "Your account is fully set up and ready to receive orders.",
                className: "bg-green-600 text-white border-none"
            });

            // Force reload to update sidebar and dashboard state
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };

    return (
        <div className="space-y-10">

            {/* Contact Section */}
            <section className="space-y-6">
                <div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Fill out your contact details and your billing address. To send orders to production this info must be filled in.
                    </p>
                    <h3 className="text-xl font-bold">Contact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="storeName" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Store Name *</Label>
                        <div className="relative">
                            <Input
                                id="storeName"
                                placeholder="Store name"
                                className="h-12"
                                value={formData.storeName}
                                onChange={handleChange}
                            />
                            <Info className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground/50 cursor-pointer hover:text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Full Name *</Label>
                        <Input
                            id="fullName"
                            className="h-12 font-medium"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Correspondence E-mail *</Label>
                        <div className="relative">
                            <Input
                                id="email"
                                className="h-12 font-medium"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <Info className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground/50 cursor-pointer hover:text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Phone Number</Label>
                        <div className="relative flex">
                            <div className="h-12 w-[120px] border rounded-l-md flex items-center justify-center bg-muted/20 border-r-0">
                                <Select defaultValue="+1" onValueChange={setCountryCode}>
                                    <SelectTrigger className="w-[120px] h-full border-0 rounded-none focus:ring-0 shadow-none px-1 bg-transparent justify-center">
                                        <SelectValue placeholder="+1" />
                                    </SelectTrigger>
                                    <SelectContent className="h-[200px]">
                                        <SelectItem value="+1">🇺🇸 US (+1)</SelectItem>
                                        <SelectItem value="+44">🇬🇧 UK (+44)</SelectItem>
                                        <SelectItem value="+90">🇹🇷 TR (+90)</SelectItem>
                                        <SelectItem value="+49">🇩🇪 DE (+49)</SelectItem>
                                        <SelectItem value="+33">🇫🇷 FR (+33)</SelectItem>
                                        <SelectItem value="+39">🇮🇹 IT (+39)</SelectItem>
                                        <SelectItem value="+34">🇪🇸 ES (+34)</SelectItem>
                                        <SelectItem value="+31">🇳🇱 NL (+31)</SelectItem>
                                        <SelectItem value="+61">🇦🇺 AU (+61)</SelectItem>
                                        <SelectItem value="+1-CA">🇨🇦 CA (+1)</SelectItem>
                                        <SelectItem value="+86">🇨🇳 CN (+86)</SelectItem>
                                        <SelectItem value="+81">🇯🇵 JP (+81)</SelectItem>
                                        <SelectItem value="+82">🇰🇷 KR (+82)</SelectItem>
                                        <SelectItem value="+91">🇮🇳 IN (+91)</SelectItem>
                                        <SelectItem value="+7">🇷🇺 RU (+7)</SelectItem>
                                        <SelectItem value="+55">🇧🇷 BR (+55)</SelectItem>
                                        <SelectItem value="+52">🇲🇽 MX (+52)</SelectItem>
                                        <SelectItem value="+27">🇿🇦 ZA (+27)</SelectItem>
                                        <SelectItem value="+41">🇨🇭 CH (+41)</SelectItem>
                                        <SelectItem value="+46">🇸🇪 SE (+46)</SelectItem>
                                        <SelectItem value="+47">🇳🇴 NO (+47)</SelectItem>
                                        <SelectItem value="+45">🇩🇰 DK (+45)</SelectItem>
                                        <SelectItem value="+358">🇫🇮 FI (+358)</SelectItem>
                                        <SelectItem value="+32">🇧🇪 BE (+32)</SelectItem>
                                        <SelectItem value="+48">🇵🇱 PL (+48)</SelectItem>
                                        <SelectItem value="+43">🇦🇹 AT (+43)</SelectItem>
                                        <SelectItem value="+351">🇵🇹 PT (+351)</SelectItem>
                                        <SelectItem value="+30">🇬🇷 GR (+30)</SelectItem>
                                        <SelectItem value="+420">🇨🇿 CZ (+420)</SelectItem>
                                        <SelectItem value="+36">🇭🇺 HU (+36)</SelectItem>
                                        <SelectItem value="+40">🇷🇴 RO (+40)</SelectItem>
                                        <SelectItem value="+971">🇦🇪 AE (+971)</SelectItem>
                                        <SelectItem value="+966">🇸🇦 SA (+966)</SelectItem>
                                        <SelectItem value="+20">🇪🇬 EG (+20)</SelectItem>
                                        <SelectItem value="+972">🇮🇱 IL (+972)</SelectItem>
                                        <SelectItem value="+65">🇸🇬 SG (+65)</SelectItem>
                                        <SelectItem value="+60">🇲🇾 MY (+60)</SelectItem>
                                        <SelectItem value="+62">🇮🇩 ID (+62)</SelectItem>
                                        <SelectItem value="+66">🇹🇭 TH (+66)</SelectItem>
                                        <SelectItem value="+84">🇻🇳 VN (+84)</SelectItem>
                                        <SelectItem value="+63">🇵🇭 PH (+63)</SelectItem>
                                        <SelectItem value="+54">🇦🇷 AR (+54)</SelectItem>
                                        <SelectItem value="+57">🇨🇴 CO (+57)</SelectItem>
                                        <SelectItem value="+56">🇨🇱 CL (+56)</SelectItem>
                                        <SelectItem value="+51">🇵🇪 PE (+51)</SelectItem>
                                        <SelectItem value="+64">🇳🇿 NZ (+64)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Input
                                id="phone"
                                className="h-12 rounded-l-none"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Label className="text-base font-normal">Are you an individual or a legal entity?</Label>
                    <RadioGroup defaultValue="individual" className="flex items-center gap-6">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="individual" id="individual" className="text-[#FF7D5F] border-[#FF7D5F]" />
                            <Label htmlFor="individual" className="font-normal text-base cursor-pointer">Individual</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="entity" id="entity" />
                            <Label htmlFor="entity" className="font-normal text-base cursor-pointer">Legal entity</Label>
                        </div>
                    </RadioGroup>
                </div>
            </section>

            {/* Billing Address Section */}
            <section className="space-y-6">
                <h3 className="text-xl font-bold">Billing address</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-[#FF7D5F] uppercase tracking-wide">Country *</Label>
                        <Select value={billingData.country} onValueChange={(val) => handleBillingSelectChange("country", val)}>
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="us">United States</SelectItem>
                                <SelectItem value="tr">Turkey</SelectItem>
                                <SelectItem value="uk">United Kingdom</SelectItem>
                                <SelectItem value="de">Germany</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">City *</Label>
                        <Input id="city" value={billingData.city} onChange={handleBillingChange} className="h-12" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Zip / Postal Code *</Label>
                        <Input id="zip" value={billingData.zip} onChange={handleBillingChange} className="h-12" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Address Line 1 *</Label>
                        <Input id="address1" value={billingData.address1} onChange={handleBillingChange} className="h-12" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Address Line 2 (Optional)</Label>
                        <Input id="address2" value={billingData.address2} onChange={handleBillingChange} className="h-12" />
                    </div>
                </div>
            </section>

            {/* Payment Method Section */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-2">Payment Card</h3>
                    <p className="text-sm text-muted-foreground">
                        Please provide your credit/ debit card. Unless agreed otherwise, you will be charged upon sending an order to production.
                    </p>
                </div>

                {!paymentMethod ? (
                    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <DialogTrigger asChild>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-slate-50 transition-all group h-[200px]">
                                <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <CreditCard className="h-6 w-6 text-slate-500" />
                                </div>
                                <h4 className="font-bold text-lg text-slate-700">Add a credit/debit card</h4>
                                <p className="text-sm text-slate-500 mt-1">Click to add payment method</p>
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
                    <div className="border border-slate-200 rounded-xl p-6 flex items-center justify-between bg-white shadow-sm">
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

            <div className="pt-6 border-t">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h4 className="font-medium">Account Status</h4>
                        <div className="flex items-center gap-2">
                            {isSetupComplete() ? (
                                <span className="flex items-center text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                    <CheckCircle2 className="h-4 w-4 mr-1" /> Complete
                                </span>
                            ) : (
                                <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">Processing Setup</span>
                            )}
                        </div>
                    </div>

                    <Button size="lg" className="bg-black hover:bg-slate-800 text-white min-w-[200px] h-12 text-base" onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
