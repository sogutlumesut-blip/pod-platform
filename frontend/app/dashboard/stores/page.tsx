"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/lib/config";
import { ArrowRight, PlayCircle, ShoppingBag, Store, CheckCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// ... imports
import { ConnectStoreDialog } from "@/components/dashboard/ConnectStoreDialog";

export default function StoresPage() {
    const { toast } = useToast();
    // ... other state

    // Add state for managing the dialog
    const [connectDialogOpen, setConnectDialogOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<string>('etsy');

    const initiateConnect = (platform: string) => {
        setSelectedPlatform(platform);
        setConnectDialogOpen(true);
    };

    const handleConnectSuccess = async () => {
        // This function is now called AFTER the dialog simulation
        const platform = selectedPlatform;
        setLoading(platform);
        try {
            // Mock connection details
            const shopName = platform === 'etsy' ? "My Etsy Shop" : "My Shop";
            // Simulate API call to backend
            const response = await fetch(`${API_URL}/integrations/connect/${platform}?shop_name=${encodeURIComponent(shopName)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: 1 }) // Hardcoded user for prototype
            });

            if (response.ok) {
                const store = await response.json();
                setConnectedStores(prev => ({ ...prev, [platform]: store }));
                toast({
                    title: "Store Connected!",
                    description: `Successfully connected to ${shopName}.`,
                });
            } else {
                throw new Error("Failed to connect");
            }
        } catch (error) {
            toast({
                title: "Connection Failed",
                description: "Could not connect to store. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(null);
        }
    };

    // ... handleSync ...

    // ... isConnected ...

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
            <ConnectStoreDialog
                open={connectDialogOpen}
                onOpenChange={setConnectDialogOpen}
                platform={selectedPlatform}
                onConnect={handleConnectSuccess}
            />

            {/* Header */}
            {/* ... */}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Etsy Card */}
                <Card className={`border shadow-sm transition-all ${isConnected('etsy') ? 'border-primary/20 bg-primary/5' : 'hover:shadow-md'}`}>
                    <CardHeader className="pb-4">
                        {/* ... content */}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* ... content */}
                    </CardContent>
                    <CardFooter className="pt-2 gap-3">
                        {!isConnected('etsy') ? (
                            <Button
                                onClick={() => initiateConnect('etsy')} // Changed to initiate dialog
                                disabled={loading === 'etsy'}
                                className="w-full sm:w-auto bg-black hover:bg-slate-800 text-white font-semibold h-12 px-8 text-base"
                            >
                                {loading === 'etsy' ? (
                                    <>Connecting...</>
                                ) : (
                                    <>Connect Etsy Store <ArrowRight className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        ) : (
                          // ... existing connected buttons
                        )}
                    </CardFooter>
                </Card>

                {/* ... other cards */}
            </div>
        </div>
    );
}
