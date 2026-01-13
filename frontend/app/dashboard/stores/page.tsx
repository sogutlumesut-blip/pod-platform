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

export default function StoresPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState<string | null>(null);
    const [connectedStores, setConnectedStores] = useState<Record<string, any>>({});
    const [syncing, setSyncing] = useState<string | null>(null);

    const handleConnect = async (platform: string) => {
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

    const handleSync = async (platform: string) => {
        const store = connectedStores[platform];
        if (!store) return;

        setSyncing(platform);
        try {
            const response = await fetch(`${API_URL}/integrations/sync/${store.id}`, {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                toast({
                    title: "Sync Complete",
                    description: data.message,
                });
            }
        } catch (error) {
            toast({
                title: "Sync Failed",
                description: "Could not sync orders.",
                variant: "destructive",
            });
        } finally {
            setSyncing(null);
        }
    }

    const isConnected = (platform: string) => !!connectedStores[platform];

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
                <p className="text-muted-foreground text-lg">
                    Connect Printseekers with your store now! Check out the <Link href="/docs" className="text-primary underline font-medium hover:text-primary/80">guides</Link> to help you connect!
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Etsy Card */}
                <Card className={`border shadow-sm transition-all ${isConnected('etsy') ? 'border-primary/20 bg-primary/5' : 'hover:shadow-md'}`}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {/* Etsy Logo Mock */}
                                <span className="text-[#F1641E] font-serif text-3xl font-bold">Etsy</span>
                                <div className="h-6 w-px bg-border mx-2"></div>
                                <CardTitle className="text-xl">Connect Etsy Store</CardTitle>
                            </div>
                            {isConnected('etsy') ? (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 items-center gap-1">
                                    <CheckCircle className="h-3 w-3" /> Connected
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-normal hover:bg-slate-100">Not connected</Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-1.5 shrink-0 self-stretch bg-[#F1641E] rounded-full"></div>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {isConnected('etsy')
                                    ? "Your store 'My Etsy Shop' is connected. Orders will sync automatically every hour."
                                    : "Connect your Etsy store to sync orders directly for fast fulfillment."}
                            </p>
                        </div>

                        {!isConnected('etsy') && (
                            <Link href="#" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors font-medium">
                                <PlayCircle className="mr-2 h-5 w-5" />
                                Watch tutorial
                            </Link>
                        )}
                    </CardContent>
                    <CardFooter className="pt-2 gap-3">
                        {!isConnected('etsy') ? (
                            <Button
                                onClick={() => handleConnect('etsy')}
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
                            <>
                                <Button variant="outline" className="h-12 border-slate-300">
                                    Settings
                                </Button>
                                <Button
                                    onClick={() => handleSync('etsy')}
                                    disabled={syncing === 'etsy'}
                                    className="h-12 bg-primary hover:bg-primary/90"
                                >
                                    <RefreshCw className={`mr-2 h-4 w-4 ${syncing === 'etsy' ? 'animate-spin' : ''}`} />
                                    {syncing === 'etsy' ? 'Syncing...' : 'Sync Orders Now'}
                                </Button>
                            </>
                        )}
                    </CardFooter>
                </Card>

                {/* Shopify Card - Placeholder Logic */}
                <Card className="border shadow-sm hover:shadow-md transition-shadow opacity-75">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <ShoppingBag className="h-8 w-8 text-[#95BF47] fill-current" />
                                    <span className="text-[#95BF47] font-bold text-2xl tracking-tighter">shopify</span>
                                </div>
                                <div className="h-6 w-px bg-border mx-2"></div>
                                <CardTitle className="text-xl">Connect Shopify Store</CardTitle>
                            </div>
                            <Badge variant="outline">Coming Soon</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-1.5 shrink-0 self-stretch bg-[#95BF47] rounded-full"></div>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Connect your Shopify store to sync orders directly for fast fulfillment.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button disabled variant="secondary" className="w-full sm:w-auto h-12 px-8 text-base">
                            Connect Shopify Store
                        </Button>
                    </CardFooter>
                </Card>

                {/* WooCommerce Card - Placeholder Logic */}
                <Card className="border shadow-sm hover:shadow-md transition-shadow opacity-75">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-[#96588A] font-bold text-3xl tracking-tight">Woo</span>
                                <div className="h-6 w-px bg-border mx-2"></div>
                                <CardTitle className="text-xl">Connect WooCommerce</CardTitle>
                            </div>
                            <Badge variant="outline">Coming Soon</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-1.5 shrink-0 self-stretch bg-[#96588A] rounded-full"></div>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Connect your WooCommerce store to sync orders directly for fast fulfillment.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button disabled variant="secondary" className="w-full sm:w-auto h-12 px-8 text-base">
                            Connect WooCommerce
                        </Button>
                    </CardFooter>
                </Card>

                {/* Ideas Card */}
                <Card className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">Give us ideas</CardTitle>
                            <Store className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Thinking of a platform we integrate with? Let us know!
                        </p>
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button variant="outline" className="h-12 px-8 text-base">
                            Submit Idea
                        </Button>
                    </CardFooter>
                </Card>

            </div>
        </div>
    );
}
