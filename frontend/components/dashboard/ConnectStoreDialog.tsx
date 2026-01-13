"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

interface ConnectStoreDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    platform: string;
    onConnect: () => void;
}

export function ConnectStoreDialog({ open, onOpenChange, platform, onConnect }: ConnectStoreDialogProps) {
    const [step, setStep] = useState<'login' | 'authorize' | 'success'>('login');
    const [isLoading, setIsLoading] = useState(false);

    // Reset state when dialog opens
    useEffect(() => {
        if (open) {
            setStep('login');
            setIsLoading(false);
        }
    }, [open]);

    const handleLogin = () => {
        setIsLoading(true);
        // Simulate network delay for login
        setTimeout(() => {
            setIsLoading(false);
            setStep('authorize');
        }, 1500);
    };

    const handleAuthorize = () => {
        setIsLoading(true);
        // Simulate network delay for authorization and callback
        setTimeout(() => {
            setIsLoading(false);
            setStep('success');
            setTimeout(() => {
                onConnect(); // Trigger the actual connection logic in parent
                setTimeout(() => {
                    onOpenChange(false); // Close dialog
                }, 1000);
            }, 1000);
        }, 1500);
    };

    const platformName = platform === 'etsy' ? 'Etsy' : platform === 'shopify' ? 'Shopify' : 'Store';
    const platformColor = platform === 'etsy' ? '#F1641E' : '#96bf48';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 shadow-2xl">
                {/* Mock Browser Header for realism */}
                <div className="bg-slate-100 dark:bg-slate-800 border-b px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-950 rounded-md px-3 py-1 text-xs text-muted-foreground flex items-center justify-center w-64 shadow-sm border opacity-70">
                        <span className="truncate">https://{platform}.com/oauth/authorize?client_id=...</span>
                    </div>
                    <div className="w-10"></div>
                </div>

                <div className="p-8 min-h-[400px] flex flex-col justify-center items-center text-center">

                    {step === 'login' && (
                        <div className="space-y-6 w-full animate-in fade-in zoom-in-95 duration-300">
                            <div className="mx-auto h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                {/* Simple text logo for generic feel */}
                                <span className="font-bold text-2xl" style={{ color: platformColor }}>{platformName}</span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">Sign in to {platformName}</h3>
                                <p className="text-muted-foreground">Authorize PrintMarkt to access your shop data.</p>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <input className="w-full h-10 px-3 rounded-md border text-sm" placeholder="Email or Username" defaultValue="demo@printmarkt.com" readOnly />
                                    <input className="w-full h-10 px-3 rounded-md border text-sm" type="password" value="********" readOnly />
                                </div>
                                <Button
                                    className="w-full h-11 text-lg font-semibold"
                                    style={{ backgroundColor: platformColor }}
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In'}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">This is a mock OAuth window for demonstration.</p>
                        </div>
                    )}

                    {step === 'authorize' && (
                        <div className="space-y-6 w-full animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="relative mx-auto h-24 w-full flex justify-center items-center mb-6">
                                <div className="h-16 w-16 bg-white border shadow-sm rounded-xl flex items-center justify-center z-10">
                                    <div className="h-8 w-8 bg-black rounded-full"></div>{/* PrintMarkt Logo Placeholder */}
                                </div>
                                <div className="absolute w-32 h-0.5 bg-slate-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loading-line"></div>
                                <div className="h-16 w-16 bg-white border shadow-sm rounded-xl flex items-center justify-center z-10">
                                    <span className="font-bold text-xl" style={{ color: platformColor }}>{platformName[0]}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">PrintMarkt wants to access your account</h3>
                                <p className="text-muted-foreground text-sm max-w-xs mx-auto">This will allow PrintMarkt to sync your orders and upload production files.</p>
                            </div>

                            <div className="pt-4">
                                <Button
                                    size="lg"
                                    className="w-full font-bold"
                                    onClick={handleAuthorize}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Allow Access'}
                                </Button>
                                <Button variant="ghost" className="w-full mt-2" onClick={() => onOpenChange(false)}>Cancel</Button>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="space-y-6 w-full animate-in zoom-in duration-500">
                            <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-green-700">Connected!</h3>
                                <p className="text-muted-foreground">Redirecting you back to PrintMarkt...</p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
