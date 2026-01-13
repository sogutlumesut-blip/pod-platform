"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CreditCard, Plus } from "lucide-react";

interface AddPaymentMethodDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddPaymentMethodDialog({ open, onOpenChange }: AddPaymentMethodDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-10 flex flex-col items-center gap-6">
                <DialogHeader className="w-full flex flex-col items-center space-y-4">

                    {/* Header Icon */}
                    <div className="h-16 w-16 mb-2 text-slate-500 relative">
                        <CreditCard className="h-16 w-16 text-slate-500 stroke-1" />
                        <Plus className="h-6 w-6 absolute top-2 right-0 text-slate-500 stroke-[3]" />
                    </div>

                    <DialogTitle className="text-3xl font-bold text-center">
                        Please choose your payment card type.
                    </DialogTitle>
                    <div className="text-slate-500 text-center">
                        Choose the card type from the dropdown below.
                    </div>
                </DialogHeader>

                <div className="w-full space-y-8 py-6">
                    <div className="space-y-2 relative">
                        <Label className="absolute -top-2.5 left-4 bg-background px-1 text-xs font-bold text-[#b91c1c] uppercase tracking-wide z-10">
                            Card *
                        </Label>
                        <Select>
                            <SelectTrigger className="h-14 border-[#b91c1c] focus:ring-[#b91c1c] text-lg">
                                <SelectValue placeholder="Card type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="visa">Visa</SelectItem>
                                <SelectItem value="mastercard">Mastercard</SelectItem>
                                <SelectItem value="amex">American Express</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 relative">
                        <Label className="absolute -top-2.5 left-4 bg-background px-1 text-xs font-bold text-[#b91c1c] uppercase tracking-wide z-10">
                            Billing Currency *
                        </Label>
                        <Select>
                            <SelectTrigger className="h-14 border-[#b91c1c] focus:ring-[#b91c1c] text-lg">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="usd">USD - US Dollar</SelectItem>
                                <SelectItem value="eur">EUR - Euro</SelectItem>
                                <SelectItem value="try">TRY - Turkish Lira</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-center gap-4 w-full pt-4">
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-12 border-slate-300 text-base font-semibold px-8 min-w-[140px]"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="lg"
                        className="h-12 bg-[#FF6B55] hover:bg-[#FF6B55]/90 text-white text-base font-semibold px-8 min-w-[140px]"
                        onClick={() => onOpenChange(false)}
                    >
                        Continue
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}
