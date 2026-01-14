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
                            <div className="h-12 w-[80px] border rounded-l-md flex items-center justify-center bg-muted/20 border-r-0">
                                <Select defaultValue="+1" onValueChange={setCountryCode}>
                                    <SelectTrigger className="w-full h-full border-0 rounded-none focus:ring-0 shadow-none px-1 bg-transparent justify-center">
                                        <SelectValue placeholder="+1" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                                        <SelectItem value="+90">🇹🇷 +90</SelectItem>
                                        <SelectItem value="+49">🇩🇪 +49</SelectItem>
                                        <SelectItem value="+33">🇫🇷 +33</SelectItem>
                                        <SelectItem value="+31">🇳🇱 +31</SelectItem>
                                        <SelectItem value="+39">🇮🇹 +39</SelectItem>
                                        <SelectItem value="+34">🇪🇸 +34</SelectItem>
                                        <SelectItem value="+61">🇦🇺 +61</SelectItem>
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
