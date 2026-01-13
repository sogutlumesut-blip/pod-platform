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

export default function SettingsPage() {
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
                            <Input id="storeName" placeholder="Store name" className="h-12" />
                            <Info className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground/50 cursor-pointer hover:text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Full Name *</Label>
                        <Input id="fullName" defaultValue="Duvar Kağıdı Marketi" className="h-12 font-medium" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Correspondence E-mail *</Label>
                        <div className="relative">
                            <Input id="email" defaultValue="sogutlumesut@gmail.com" className="h-12 font-medium" />
                            <Info className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground/50 cursor-pointer hover:text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Phone Number</Label>
                        <div className="relative flex">
                            <div className="h-12 w-[80px] border rounded-l-md flex items-center justify-center bg-muted/20 border-r-0">
                                {/* Mock Flag/Code */}
                                <span className="mr-1">🇺🇸</span>
                                <span className="text-sm font-medium">+1</span>
                            </div>
                            <Input id="phone" className="h-12 rounded-l-none" />
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
                <Button size="lg" className="bg-black hover:bg-slate-800 text-white min-w-[200px] h-12 text-base">
                    Save Changes
                </Button>
            </div>

        </div>
    );
}
