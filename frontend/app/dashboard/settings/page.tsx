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

export default function SettingsPage() {
    const { toast } = useToast();
    const [countryCode, setCountryCode] = useState("+1");
    const [formData, setFormData] = useState({
        storeName: "",
        fullName: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        // Load user session on mount
        const session = localStorage.getItem("user_session");
        if (session) {
            try {
                const userData = JSON.parse(session);
                setFormData(prev => ({
                    ...prev,
                    fullName: userData.name || "",
                    email: userData.email || "",
                    phone: userData.phone || ""
                }));
                // Try to parse country code from phone or default
                if (userData.phone && userData.phone.startsWith("+")) {
                    // unexpected simple parsing logic if needed, or just keep manual
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

    const handleSave = () => {
        // Update local storage to persist changes
        const currentSession = localStorage.getItem("user_session");
        if (currentSession) {
            const userData = JSON.parse(currentSession);
            const updatedData = {
                ...userData,
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone // In a real app we'd combine code + number
            };
            localStorage.setItem("user_session", JSON.stringify(updatedData));

            // Also trigger a custom event or let Sidebar know (Sidebar polls or we reload)
            // For now just toast
            toast({
                title: "Settings Saved",
                description: "Your profile information has been updated.",
            });

            // Force reload to update sidebar name immediately if changed
            window.location.reload();
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
                        <Select>
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="us">United States</SelectItem>
                                <SelectItem value="tr">Turkey</SelectItem>
                                <SelectItem value="uk">United Kingdom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">State</Label>
                        <Select disabled>
                            <SelectTrigger className="h-12 bg-muted/20">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">City</Label>
                        <Input className="h-12" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Zip / Postal Code</Label>
                        <Input className="h-12" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Address Line 1</Label>
                        <Input className="h-12" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Address Line 2 (Optional)</Label>
                        <Input className="h-12" />
                    </div>
                </div>
            </section>

            <div className="pt-6">
                <Button size="lg" className="bg-black hover:bg-slate-800 text-white min-w-[200px] h-12 text-base" onClick={handleSave}>
                    Save Changes
                </Button>
            </div>

        </div>
    );
}
